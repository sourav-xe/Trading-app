import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    currentPrice: { type: Number, required: true },
    description: { type: String },
    keyMetrics: {
      peRatio: { type: Number },
      marketCap: { type: String },
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
export default Product;
