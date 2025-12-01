const TicketModel = require("../models/Ticket");

module.exports = {
  Create: async (obj) => {
    return TicketModel.create(obj);
  },

  Find: async (where) => {
    return TicketModel.find(where);
  },
  FindOne: async (where) => {
    return TicketModel.findOne(where);
  },

  Update: async (where, obj) => {
    return TicketModel.findOneAndUpdate(where, obj, { new: true });
  },
};
