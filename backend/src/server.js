const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const adminBookingsRoutes = require("./routes/adminBookingsRoutes");
const adminSectionsRoutes = require("./routes/adminSectionsRoutes");
const assetsRoutes = require("./routes/assetsRoutes");
const tableBookingsRoutes = require("./routes/tableBookingsRoutes");
const tableSettingsRoutes = require("./routes/tableSettingsRoutes");

dotenv.config({ quiet: true });

const app = express();
const port = Number(process.env.PORT) || 5000;
const frontendOrigin = process.env.FRONTEND_ORIGIN || "http://localhost:3000";

app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(
  cors({
    origin: frontendOrigin,
    credentials: true,
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

app.use("/api/admin/bookings", adminBookingsRoutes);
app.use("/api/admin/sections", adminSectionsRoutes);
app.use("/api/admin/tables", tableSettingsRoutes);
app.use("/api/reservations", tableBookingsRoutes);
app.use("/api/assets", assetsRoutes);

app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    service: "ikayi-backend",
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

app.use((_req, res) => {
  res.status(404).json({ message: "Route not found" });
});

async function startServer() {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is missing from backend/.env");
  }

  await mongoose.connect(process.env.MONGODB_URI);

  app.listen(port, () => {
    console.log(`Ikayi backend running on http://localhost:${port}`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start Ikayi backend");
  console.error(error);
  process.exit(1);
});
