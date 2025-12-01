const mongoose = require("mongoose");

const BeneficiarySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    name: { type: String, required: true },
    nickname: { type: String, required: true },
    account_no: { type: String, required: true },
    bank: { type: String, required: true },
    time: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
    collection: "beneficiary",
  },
);

module.exports = mongoose.model("beneficiary", BeneficiarySchema);
