const express = require("express");
const { createBooking, getAvailability } = require("../controllers/tableBookingsController");

const router = express.Router();

router.get("/availability", getAvailability);
router.post("/bookings", createBooking);

module.exports = router;
