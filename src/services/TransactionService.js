const TransactionModel = require("../models/Transaction");

module.exports = {
  Create: async (obj) => {
    return TransactionModel.create(obj);
  },

  List: async (a, start, end) => {
    let filter = a ? { ...a } : {};

    if (start) {
      const startDate = new Date(start);
      startDate.setHours(0, 0, 0);
      const range = { $gte: startDate };

      if (end) {
        const endDate = new Date(end);
        endDate.setHours(23, 59, 59);
        range.$lte = endDate;
      }

      filter.time = range;
    }

    return TransactionModel.find(filter).sort({ time: -1 });
  },
};
