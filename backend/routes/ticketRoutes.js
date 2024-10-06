const express = require("express");
const router = express.Router();
const {
  createTicket,
  getAllTickets,
  getTicket,
  updateTicket,
  deleteTicket,
} = require("../controllers/ticketController");
const { authenticateUser } = require("../middleware/authentication");

router.use(authenticateUser);

router.route("/").post(createTicket).get(getAllTickets);
router.route("/:id").get(getTicket).patch(updateTicket).delete(deleteTicket);

module.exports = router;
