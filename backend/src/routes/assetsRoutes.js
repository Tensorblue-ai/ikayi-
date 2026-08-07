const express = require("express");
const multer = require("multer");
const {
  allowedImageTypes,
  createUnsupportedImageError,
  handleUploadError,
  streamAssetByKey,
  uploadAdminAsset,
} = require("../controllers/assetsController");

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1,
  },
  fileFilter: (_req, file, callback) => {
    if (!allowedImageTypes.has(file.mimetype)) {
      callback(createUnsupportedImageError());
      return;
    }

    callback(null, true);
  },
});

router.post("/admin/upload", (req, res, next) => {
  upload.single("file")(req, res, (error) => {
    if (error) {
      handleUploadError(error, req, res, next);
      return;
    }

    uploadAdminAsset(req, res, next);
  });
});

router.get(/^\/(.+)$/, streamAssetByKey);

module.exports = router;
