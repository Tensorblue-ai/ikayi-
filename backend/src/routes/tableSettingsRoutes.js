const express = require("express");
const { getTableSettings, updateTableSettings } = require("../controllers/tableSettingsController");

const router = express.Router();

router.get("/settings", getTableSettings);
router.put("/settings", updateTableSettings);

module.exports = router;
