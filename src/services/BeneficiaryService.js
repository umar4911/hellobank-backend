const BeneficiaryModel = require("../models/Beneficiary");

module.exports = {
  Create: async (obj) => {
    return BeneficiaryModel.create(obj);
  },

  Update: async (where, obj) => {
    return BeneficiaryModel.findOneAndUpdate(where, obj, { new: true });
  },

  Delete: async (where) => {
    return BeneficiaryModel.findOneAndDelete(where);
  },

  List: async (where) => {
    return BeneficiaryModel.find(where);
  },

  FindOne: async (where) => {
    return BeneficiaryModel.findOne(where);
  },
};
