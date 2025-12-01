const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    id: String,
    type: String,
    name: { type: String, required: true },
    description: String,
    price: Number,
    currency: { type: String, default: "USD" },
    status: { type: String, default: "active" },
  },
  { timestamps: true },
);

module.exports = mongoose.model("product", ProductSchema);
