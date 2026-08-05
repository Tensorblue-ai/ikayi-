const express = require("express");
const {
  getAdminSectionByKey,
  getAdminSections,
  updateAdminSectionByKey,
} = require("../controllers/adminSectionsController");

const router = express.Router();

router.get("/", getAdminSections);
router.get("/:sectionKey", getAdminSectionByKey);
router.patch("/:sectionKey", updateAdminSectionByKey);
router.post("/:sectionKey", updateAdminSectionByKey);

module.exports = router;
