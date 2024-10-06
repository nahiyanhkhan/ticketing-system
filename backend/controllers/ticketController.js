// controllers/ticketController.js
const Ticket = require("../models/ticketModel");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");

const createTicket = async (req, res) => {
  if (!req.user || !req.user.userId) {
    throw new CustomError.UnauthenticatedError("Authentication invalid");
  }

  req.body.createdBy = req.user.userId;
  const ticket = await Ticket.create(req.body);
  res.status(StatusCodes.CREATED).json({ ticket });
};

const getAllTickets = async (req, res) => {
  const tickets = await Ticket.find({}).populate("createdBy", "email");
  res.status(StatusCodes.OK).json({ tickets, count: tickets.length });
};

const getTicket = async (req, res) => {
  const { id: ticketId } = req.params;
  const ticket = await Ticket.findOne({ _id: ticketId }).populate(
    "createdBy",
    "email"
  );

  if (!ticket) {
    throw new CustomError.NotFoundError(`No ticket with id : ${ticketId}`);
  }
  res.status(StatusCodes.OK).json({ ticket });
};

const updateTicket = async (req, res) => {
  const { id: ticketId } = req.params;
  const ticket = await Ticket.findOneAndUpdate({ _id: ticketId }, req.body, {
    new: true,
    runValidators: true,
  });

  if (!ticket) {
    throw new CustomError.NotFoundError(`No ticket with id : ${ticketId}`);
  }
  res.status(StatusCodes.OK).json({ ticket });
};

const deleteTicket = async (req, res) => {
  const { id: ticketId } = req.params;
  const ticket = await Ticket.findOne({ _id: ticketId });

  if (!ticket) {
    throw new CustomError.NotFoundError(`No ticket with id : ${ticketId}`);
  }

  await ticket.remove();
  res.status(StatusCodes.OK).json({ msg: "Success! Ticket removed." });
};

module.exports = {
  createTicket,
  getAllTickets,
  getTicket,
  updateTicket,
  deleteTicket,
};
