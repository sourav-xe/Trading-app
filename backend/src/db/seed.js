import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/Product.js";
import connectDB from "./db/db.js";

dotenv.config();

const products = [
  {
    name: "Reliance Industries",
    category: "Stock",
    currentPrice: 2800,
    description: "India's largest conglomerate with interests in energy, retail, and telecom.",
    keyMetrics: {
      peRatio: 25,
      marketCap: "₹18L Cr",
    },
  },
  {
    name: "Tata Consultancy Services (TCS)",
    category: "Stock",
    currentPrice: 3500,
    description: "Leading global IT services and consulting company.",
    keyMetrics: {
      peRatio: 28,
      marketCap: "₹13L Cr",
    },
  },
  {
    name: "HDFC Bank",
    category: "Stock",
    currentPrice: 1500,
    description: "India’s largest private sector bank by assets.",
    keyMetrics: {
      peRatio: 18,
      marketCap: "₹10L Cr",
    },
  },
  {
    name: "Nippon India Growth Fund",
    category: "Mutual Fund",
    currentPrice: 1200,
    description: "Diversified equity mutual fund focusing on growth companies.",
    keyMetrics: {
      peRatio: 20,
      marketCap: "N/A",
    },
  },
];

const importData = async () => {
  try {
    await connectDB();
    await Product.deleteMany(); // clear old data
    await Product.insertMany(products);
    console.log("✅ Data Imported!");
    process.exit();
  } catch (error) {
    console.error("❌ Error with data import:", error);
    process.exit(1);
  }
};

importData();
