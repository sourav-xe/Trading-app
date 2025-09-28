import mongoose from "mongoose";

const txSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  units: { type: Number, required: true },
  pricePerUnit: { type: Number, required: true },
  total: { type: Number, required: true },
  type: { type: String, enum: ["BUY","SELL"], default: "BUY" },
}, { timestamps: true });

const Transaction = mongoose.model("Transaction", txSchema);
export default Transaction;
