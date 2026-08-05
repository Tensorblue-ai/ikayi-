const express = require("express");
const { streamAssetByKey } = require("../controllers/assetsController");

const router = express.Router();

router.get(/^\/(.+)$/, streamAssetByKey);

module.exports = router;
