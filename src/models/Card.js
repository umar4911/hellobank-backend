const mongoose = require("mongoose");

const CardSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    type: {
      type: String,
      enum: ["Silver", "Gold", "Platinum"],
      required: true,
    },
    cardnumber: { type: String, required: true, unique: true },
    cvc: { type: String, required: true },
    expiration: { type: Date, required: true },
    isblocked: { type: Boolean, default: false },
    time: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
    collection: "cards",
  },
);

module.exports = mongoose.model("card", CardSchema);
