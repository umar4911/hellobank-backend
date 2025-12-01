const TransactionModel = require("../models/Transaction");
const moment = require("moment");

module.exports = {
  Create: async (obj) => {
    return TransactionModel.create(obj);
  },

  List: async ({ userId, account_no, start, end }) => {
    const filter = {};

    if (userId) filter.userId = userId;
    if (account_no) filter.account_no = account_no;

    filter.time = {
      $gte: new Date(start),
      $lte: new Date(end),
    };

    return TransactionModel.find(filter);
  },

  Find: async (where) => {
    return TransactionModel.find(where);
  },
};
