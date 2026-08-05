const fs = require("fs/promises");
const path = require("path");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const Experience = require("../models/Experience");
const KitchenExperience = require("../models/KitchenExperience");
const Story = require("../models/Story");
const SignatureExperience = require("../models/SignatureExperience");
const GuestJourney = require("../models/GuestJourney");
const Gallery = require("../models/Gallery");
const Reservation = require("../models/Reservation");
const { createR2Client, getR2Config, uploadFileToR2 } = require("../lib/r2Assets");

dotenv.config({ quiet: true });

function requireEnv(name) {
  const value = process.env[name] || "";

  if (!value.trim()) {
    throw new Error(`${name} is required`);
  }

  return value.trim();
}

const assetPrefix = (process.env.R2_ASSET_PREFIX || "assets").replace(/^\/+|\/+$/g, "");
const isUploadOnly = process.argv.includes("--upload-only");
const isRewriteOnly = process.argv.includes("--rewrite-only");
const localAssetsDir = path.resolve(
  process.env.LOCAL_ASSETS_DIR || path.join(__dirname, "../../../frontend/public/assets")
);

const imageFields = [
  { model: Experience, key: "experience", paths: ["heroImage", "carryHomeCards[].image"] },
  { model: KitchenExperience, key: "kitchen-experience", paths: ["images[].src"] },
  { model: Story, key: "stories", paths: ["cards[].image", "bannerImage"] },
  { model: SignatureExperience, key: "signature-experiences", paths: ["cards[].image"] },
  { model: GuestJourney, key: "guest-journey", paths: ["image"] },
  { model: Gallery, key: "gallery", paths: ["images[].src"] },
  { model: Reservation, key: "reservations", paths: ["image"] },
];

const contentTypes = {
  ".avif": "image/avif",
  ".gif": "image/gif",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
};

function toPosixPath(value) {
  return value.split(path.sep).join("/");
}

function getContentType(filePath) {
  return contentTypes[path.extname(filePath).toLowerCase()] || "application/octet-stream";
}

function getApiAssetUrl(key, apiAssetBaseUrl) {
  return `${apiAssetBaseUrl}/${key}`;
}

async function listAssetFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await listAssetFiles(fullPath)));
    } else if (entry.isFile()) {
      files.push(fullPath);
    }
  }

  return files;
}

function buildAssetUrlMap(files, apiAssetBaseUrl) {
  const urlMap = new Map();

  for (const filePath of files) {
    const relativePath = toPosixPath(path.relative(localAssetsDir, filePath));
    const key = `${assetPrefix}/${relativePath}`;
    const apiUrl = getApiAssetUrl(key, apiAssetBaseUrl);

    urlMap.set(`/assets/${relativePath}`, apiUrl);
    urlMap.set(`/assets/${encodeURI(relativePath)}`, apiUrl);
    urlMap.set(`${apiAssetBaseUrl}/${key}`, apiUrl);
    urlMap.set(`${apiAssetBaseUrl}/${encodeURI(key)}`, apiUrl);

    if (relativePath === "chef9 (2).png") {
      urlMap.set("/assets/chef9.png", apiUrl);
    }
  }

  return urlMap;
}

function getNestedValue(target, fieldPath) {
  return fieldPath.split(".").reduce((value, segment) => value?.[segment], target);
}

function replaceStringField(target, fieldPath, urlMap) {
  const segments = fieldPath.split(".");
  const field = segments.pop();
  const parent = segments.reduce((value, segment) => value?.[segment], target);

  if (!parent || !field || !urlMap.has(parent[field])) {
    return 0;
  }

  parent[field] = urlMap.get(parent[field]);
  return 1;
}

function replaceArrayField(target, fieldPath, urlMap) {
  const [arrayPath, field] = fieldPath.split("[].");
  const items = getNestedValue(target, arrayPath);

  if (!Array.isArray(items)) {
    return 0;
  }

  let replacements = 0;

  for (const item of items) {
    if (urlMap.has(item[field])) {
      item[field] = urlMap.get(item[field]);
      replacements += 1;
    }
  }

  return replacements;
}

function replaceAssetFields(section, fieldPaths, urlMap) {
  return fieldPaths.reduce((count, fieldPath) => {
    if (fieldPath.includes("[].")) {
      return count + replaceArrayField(section, fieldPath, urlMap);
    }

    return count + replaceStringField(section, fieldPath, urlMap);
  }, 0);
}

async function uploadAssets(files, config) {
  const client = createR2Client(config);

  for (const filePath of files) {
    const relativePath = toPosixPath(path.relative(localAssetsDir, filePath));
    const key = `${assetPrefix}/${relativePath}`;
    const body = await fs.readFile(filePath);

    await uploadFileToR2({
      client,
      bucket: config.bucket,
      key,
      body,
      contentType: getContentType(filePath),
    });

    console.log(`Uploaded ${key}`);
  }
}

async function rewriteMongoAssetUrls(urlMap) {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is missing from backend/.env");
  }

  await mongoose.connect(process.env.MONGODB_URI);

  try {
    for (const entry of imageFields) {
      const section = await entry.model.findOne({ sectionKey: entry.key });

      if (!section) {
        console.log(`Skipped ${entry.key}: section not found`);
        continue;
      }

      const replacements = replaceAssetFields(section, entry.paths, urlMap);

      if (replacements > 0) {
        await section.save();
      }

      console.log(`Updated ${entry.key}: ${replacements} asset URL(s)`);
    }
  } finally {
    await mongoose.disconnect();
  }
}

async function migrateAssetsToR2() {
  const config = getR2Config();
  const files = await listAssetFiles(localAssetsDir);
  if (!isRewriteOnly) {
    await uploadAssets(files, config);
  }

  if (isUploadOnly) {
    return;
  }

  const apiAssetBaseUrl = requireEnv("API_ASSET_BASE_URL").replace(/\/+$/, "");
  const urlMap = buildAssetUrlMap(files, apiAssetBaseUrl);
  await rewriteMongoAssetUrls(urlMap);
}

migrateAssetsToR2().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});
