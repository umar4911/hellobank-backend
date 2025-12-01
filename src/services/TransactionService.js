const TransactionModel = require("../models/Transaction");

module.exports = {
  Create: async (obj) => {
    return TransactionModel.create(obj);
  },

  List: async (a, start, end) => {
    let filter = a ? { ...a } : {};

    if (start) {
      const startDate = new Date(start);
      const range = { $gte: startDate };

      if (end) {
        const endDate = new Date(end);
        range.$lte = endDate;
      }

      filter.time = range;
    }

    return TransactionModel.find(filter).sort({ time: -1 });
  },
};
