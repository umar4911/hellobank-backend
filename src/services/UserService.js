const UserModel = require("../models/User");

module.exports = {
  CreateUser: async (obj) => {
    return UserModel.create(obj);
  },

  UpdateUser: async (obj, where) => {
    return UserModel.findOneAndUpdate(where, obj, { new: true });
  },

  FindUser: async (where) => {
    return UserModel.find(where);
  },

  FindOne: async (where) => {
    return UserModel.findOne(where);
  },
};
