const path = require("path");
const { createR2Client, getObjectFromR2, getR2Config } = require("../lib/r2Assets");

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

    return object.Body.pipe(res);
  } catch (error) {
    if (error.name === "NoSuchKey" || error.$metadata?.httpStatusCode === 404) {
      return res.status(404).json({ message: "Asset not found" });
    }

    return next(error);
  }
}

module.exports = {
  streamAssetByKey,
};
