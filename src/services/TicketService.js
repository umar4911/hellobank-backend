const TicketModel = require("../models/Ticket");

module.exports = {
  Create: async (obj) => {
    return TicketModel.create(obj);
  },

  Find: async (where) => {
    return TicketModel.find(where);
  },

  Reply: async (ticketId, replyObj) => {
    return TicketModel.findByIdAndUpdate(
      ticketId,
      { $push: { replies: replyObj } },
      { new: true },
    );
  },
};
