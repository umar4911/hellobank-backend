const mongoose = require("mongoose");

const TicketSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, default: "open" },
    reply: {
      sender: String,
      message: String,
      createdAt: Date,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("ticket", TicketSchema);
