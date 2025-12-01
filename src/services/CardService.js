const CardModel = require("../models/Card");

module.exports = {
  IssueCard: async (obj) => CardModel.create(obj),

  UpdateCard: async (where, obj) =>
    CardModel.findOneAndUpdate(where, obj, { new: true }),

  GetCard: async (where) => CardModel.findOne(where),

  GetCards: async (where = {}) => CardModel.find(where),
};
