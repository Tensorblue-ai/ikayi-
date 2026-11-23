const crypto = require("crypto");
const path = require("path");
const { createR2Client, getObjectFromR2, getR2Config, uploadFileToR2 } = require("../lib/r2Assets");

const allowedImageTypes = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
]);

let cachedR2;

function getR2() {
  if (!cachedR2) {
    const config = getR2Config();
    cachedR2 = {
      bucket: config.bucket,
      client: createR2Client(config),
    };
  }

  return cachedR2;
}

function isUnsafeKey(key) {
  return !key || key.includes("..") || path.isAbsolute(key) || key.startsWith("/");
}

function getAssetBaseUrl() {
  const configuredBaseUrl = (process.env.API_ASSET_BASE_URL || "/api/assets").replace(/\/+$/, "");

  if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?\/api\/assets$/i.test(configuredBaseUrl)) {
    return "/api/assets";
  }

  return configuredBaseUrl;
}

function buildAdminAssetKey(contentType) {
  const extension = allowedImageTypes.get(contentType);
  const prefix = (process.env.R2_ASSET_PREFIX || "assets").replace(/^\/+|\/+$/g, "");
  const now = new Date();
  const year = String(now.getUTCFullYear());
  const month = String(now.getUTCMonth() + 1).padStart(2, "0");
  const fileName = `${crypto.randomUUID()}.${extension}`;

  return `${prefix}/admin/${year}/${month}/${fileName}`;
}

function createUnsupportedImageError() {
  const error = new Error("Only JPEG, PNG, and WebP image uploads are allowed.");
  error.code = "UNSUPPORTED_IMAGE_TYPE";
  return error;
}

function handleUploadError(error, _req, res, next) {
  if (!error) return next();

  if (error.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({ message: "Image must be 5 MB or smaller." });
  }

  if (error.code === "LIMIT_FILE_COUNT" || error.code === "LIMIT_UNEXPECTED_FILE") {
    return res.status(400).json({ message: "Upload exactly one image file in the file field." });
  }

  if (error.code === "UNSUPPORTED_IMAGE_TYPE") {
    return res.status(400).json({ message: error.message });
  }

  return next(error);
}

function validateUploadedImage(file) {
  if (!file) {
    return "Upload exactly one image file in the file field.";
  }

  if (!allowedImageTypes.has(file.mimetype)) {
    return "Only JPEG, PNG, and WebP image uploads are allowed.";
  }

  return "";
}

async function uploadAdminAsset(req, res, next) {
  try {
    const validationError = validateUploadedImage(req.file);

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const file = req.file;
    const key = buildAdminAssetKey(file.mimetype);
    const r2 = getR2();

    await uploadFileToR2({
      client: r2.client,
      bucket: r2.bucket,
      key,
      body: file.buffer,
      contentType: file.mimetype,
    });

    return res.status(201).json({
      url: `${getAssetBaseUrl()}/${key}`,
      key,
      contentType: file.mimetype,
      size: file.size,
    });
  } catch (error) {
    return next(error);
  }
}

async function streamAssetByKey(req, res, next) {
  try {
    const key = req.params[0];

    if (isUnsafeKey(key)) {
      return res.status(400).json({ message: "Invalid asset key" });
    }

    const r2 = getR2();
    const object = await getObjectFromR2({ client: r2.client, bucket: r2.bucket, key });

    if (object.ContentType) {
      res.setHeader("Content-Type", object.ContentType);
    }

    if (object.ContentLength) {
      res.setHeader("Content-Length", String(object.ContentLength));
    }

    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");

    object.Body.on("error", (error) => res.destroy(error));
    return object.Body.pipe(res);
  } catch (error) {
    if (error.name === "NoSuchKey" || error.$metadata?.httpStatusCode === 404) {
      return res.status(404).json({ message: "Asset not found" });
    }

    return next(error);
  }
}

module.exports = {
  allowedImageTypes,
  createUnsupportedImageError,
  handleUploadError,
  streamAssetByKey,
  uploadAdminAsset,
};
