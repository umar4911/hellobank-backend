const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    fname: { type: String, required: true },
    lname: { type: String, required: true },
    cnic: { type: String, required: true, unique: true },
    address: { type: String, required: true },
    gender: { type: String, enum: ["m", "f"], required: true },
    bdate: { type: Date, required: true },
    email: { type: String, required: true, unique: true },
    account_no: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    balance: { type: Number, default: 0 },
    closed: { type: Boolean, default: false },
    timeregistered: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
    collection: "users",
  },
);

module.exports = mongoose.model("user", UserSchema);
