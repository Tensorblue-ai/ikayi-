const express = require("express");
const { getAdminBookings } = require("../controllers/tableBookingsController");

const router = express.Router();

router.get("/", getAdminBookings);

module.exports = router;
