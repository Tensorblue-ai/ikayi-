const express = require("express");
const { getPublicReservationTypes } = require("../controllers/reservationTypesController");

const router = express.Router();

router.get("/types", getPublicReservationTypes);

module.exports = router;