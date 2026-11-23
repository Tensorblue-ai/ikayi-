require("server-only");
const mongoose = require("mongoose");
const { PassThrough, Readable } = require("node:stream");
const sections = require("./controllers/adminSectionsController");
const reservations = require("./controllers/reservationTypesController");
const bookings = require("./controllers/tableBookingsController");
const tables = require("./controllers/tableSettingsController");
const assets = require("./controllers/assetsController");

async function connectDatabase() {
  if (mongoose.connection.readyState === 1) return;
  if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI is required");
  if (!globalThis.ikayiDatabasePromise) {
    globalThis.ikayiDatabasePromise = mongoose.connect(process.env.MONGODB_URI, {
      maxPoolSize: 5,
      serverSelectionTimeoutMS: 10000,
    }).catch((error) => {
      globalThis.ikayiDatabasePromise = undefined;
      throw error;
    });
  }
  await globalThis.ikayiDatabasePromise;
}

function resolveRoute(path, method) {
  const routes = {
    "admin/sections": { GET: sections.getAdminSections },
    "admin/bookings": { GET: bookings.getAdminBookings },
    "admin/tables/settings": { GET: tables.getTableSettings, PUT: tables.updateTableSettings },
    "admin/reservation-types": { GET: reservations.getAdminReservationTypes, POST: reservations.createReservationType },
    "reservations/types": { GET: reservations.getPublicReservationTypes },
    "reservations/availability": { GET: bookings.getAvailability },
    "reservations/bookings": { POST: bookings.createBooking },
    "assets/admin/upload": { POST: assets.uploadAdminAsset },
  };
  let handlers = routes[path];
  let params = {};
  if (!handlers && /^admin\/sections\/[^/]+$/.test(path)) {
    handlers = { GET: sections.getAdminSectionByKey, PATCH: sections.updateAdminSectionByKey, POST: sections.updateAdminSectionByKey };
    params = { sectionKey: path.split("/").pop() };
  } else if (!handlers && /^admin\/reservation-types\/[^/]+$/.test(path)) {
    handlers = { PATCH: reservations.updateReservationType, DELETE: reservations.deleteReservationType };
    params = { slug: path.split("/").pop() };
  } else if (!handlers && path.startsWith("assets/")) {
    handlers = { GET: assets.streamAssetByKey };
    params = { 0: path.slice(7) };
  }
  return { handler: handlers?.[method], handlers, params };
}

async function handleApi(request) {
  const url = new URL(request.url);
  let path;
  try {
    path = decodeURIComponent(url.pathname.replace(/^\/api\//, "").replace(/\/+$/, ""));
  } catch {
    return Response.json({ message: "Invalid request path." }, { status: 400 });
  }
  const { handler, handlers, params } = resolveRoute(path, request.method);
  if (!handlers) return Response.json({ message: "Route not found" }, { status: 404 });
  if (!handler) return Response.json({ message: "Method not allowed" }, { status: 405, headers: { Allow: Object.keys(handlers).join(", ") } });

  try {
    const req = { params, query: Object.fromEntries(url.searchParams), body: {} };
    if (path === "assets/admin/upload") {
      const form = await request.formData();
      const files = form.getAll("file");
      const file = files[0];
      if (files.length !== 1 || !file || typeof file === "string" || [...form.values()].filter((value) => typeof value !== "string").length !== 1) {
        return Response.json({ message: "Upload exactly one image file in the file field." }, { status: 400 });
      }
      if (file.size > 4 * 1024 * 1024) return Response.json({ message: "Image must be 4 MB or smaller." }, { status: 400 });
      req.file = { mimetype: file.type, size: file.size, buffer: Buffer.from(await file.arrayBuffer()) };
    } else if (["POST", "PATCH", "PUT"].includes(request.method)) {
      try {
        const body = await request.text();
        if (Buffer.byteLength(body) > 1024 * 1024) return Response.json({ message: "Request body is too large." }, { status: 413 });
        req.body = JSON.parse(body);
      } catch {
        return Response.json({ message: "Invalid JSON body." }, { status: 400 });
      }
      if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
        return Response.json({ message: "Invalid JSON body." }, { status: 400 });
      }
    }
    if (!path.startsWith("assets/")) await connectDatabase();
    let response;
    let status = 200;
    const headers = new Headers();
    const res = new PassThrough();
    res.status = (value) => { status = value; return res; };
    res.setHeader = (name, value) => headers.set(name, value);
    res.json = (value) => {
      headers.set("Content-Type", "application/json");
      response = new Response(JSON.stringify(value, (_key, item) => typeof item === "string"
        ? item.replace(/^https?:\/\/((localhost|127\.0\.0\.1|20\.51\.219\.119)(:\d+)?|[a-z0-9-]+\.trycloudflare\.com)\/api\/assets\//i, "/api/assets/")
        : item), { status, headers });
      res.end();
      return res;
    };
    await handler(req, res, (error) => { if (error) throw error; });
    if (response) return response;
    return new Response(Readable.toWeb(res), { status, headers });
  } catch (error) {
    console.error("Ikayi API request failed", error);
    return Response.json({ message: "Unable to process request. Please try again." }, { status: 500 });
  }
}

module.exports = { handleApi, connectDatabase };
