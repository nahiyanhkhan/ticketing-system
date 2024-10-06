const mongoose = require("mongoose");

const TicketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a title"],
      maxlength: 100,
    },
    description: {
      type: String,
      required: [true, "Please provide a description"],
    },
    deviceType: {
      type: String,
      required: [true, "Please specify the device type"],
      enum: [
        "mouse",
        "keyboard",
        "monitor",
        "laptop",
        "desktop",
        "printer",
        "other",
      ],
    },
    priority: {
      type: String,
      required: true,
      enum: ["low", "medium", "high", "critical"],
      default: "low",
    },
    status: {
      type: String,
      required: true,
      enum: ["open", "in-progress", "resolved", "closed"],
      default: "open",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Ticket", TicketSchema);
