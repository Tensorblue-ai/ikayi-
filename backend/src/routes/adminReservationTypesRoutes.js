const express = require("express");
const {
  createReservationType,
  deleteReservationType,
  getAdminReservationTypes,
  updateReservationType,
} = require("../controllers/reservationTypesController");

const router = express.Router();

router.get("/", getAdminReservationTypes);
router.post("/", createReservationType);
router.patch("/:slug", updateReservationType);
router.delete("/:slug", deleteReservationType);

module.exports = router;