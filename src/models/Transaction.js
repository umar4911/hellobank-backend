const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    name: { type: String, required: true },
    account_no: { type: String, required: true },
    bank: { type: String, required: true },

    amount: { type: Number, required: true },

    type: {
      type: String,
      enum: ["transfer", "purchase"],
      required: true,
    },

    time: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
    collection: "transactions",
  },
);

module.exports = mongoose.model("transaction", TransactionSchema);
