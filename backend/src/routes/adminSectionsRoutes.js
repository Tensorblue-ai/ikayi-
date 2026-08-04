const express = require("express");
const {
  getAdminSectionByKey,
  getAdminSections,
} = require("../controllers/adminSectionsController");

const router = express.Router();

router.get("/", getAdminSections);
router.get("/:sectionKey", getAdminSectionByKey);

module.exports = router;
