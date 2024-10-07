const express = require("express");
const router = express.Router();
const {
  createTicket,
  getAllTickets,
  getTicket,
  updateTicket,
  deleteTicket,
  addReplyToTicket,
} = require("../controllers/ticketController");
const { authenticateUser } = require("../middleware/authentication");

router.use(authenticateUser);

router.route("/").post(createTicket).get(getAllTickets);
router.route("/:id").get(getTicket).patch(updateTicket).delete(deleteTicket);
router.route("/:id/reply").post(addReplyToTicket);

module.exports = router;
