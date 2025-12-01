const ProductModel = require("../models/Product");

module.exports = {
  Create: async (obj) => {
    return ProductModel.create(obj);
  },

  Find: async (where) => {
    return ProductModel.find(where);
  },

  FindOne: async (where) => {
    return ProductModel.findOne(where);
  },
};
