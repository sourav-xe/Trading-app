// src/seeder.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "./db/db.js";

import Product from "./models/Product.js";

dotenv.config();

const products = [
  // Indian Stocks
  { 
    name: "Reliance Industries", 
    category: "Stock", 
    currentPrice: 2800, 
    description: "India's largest private sector conglomerate", 
    keyMetrics: { peRatio: 25, marketCap: "18T" } 
  },
  { 
    name: "TCS", 
    category: "Stock", 
    currentPrice: 3500, 
    description: "Global IT services and consulting leader", 
    keyMetrics: { peRatio: 28, marketCap: "12T" } 
  },
  { 
    name: "HDFC Bank", 
    category: "Stock", 
    currentPrice: 1500, 
    description: "Leading private sector bank in India", 
    keyMetrics: { peRatio: 18, marketCap: "9T" } 
  },
  { 
    name: "Infosys", 
    category: "Stock", 
    currentPrice: 1400, 
    description: "IT services and consulting multinational", 
    keyMetrics: { peRatio: 22, marketCap: "6T" } 
  },
  { 
    name: "ICICI Bank", 
    category: "Stock", 
    currentPrice: 960, 
    description: "Major private sector bank in India", 
    keyMetrics: { peRatio: 20, marketCap: "7T" } 
  },
  { 
    name: "Hindustan Unilever", 
    category: "Stock", 
    currentPrice: 2650, 
    description: "FMCG giant with strong consumer brands", 
    keyMetrics: { peRatio: 35, marketCap: "6T" } 
  },
  { 
    name: "Mahindra & Mahindra", 
    category: "Stock", 
    currentPrice: 1620, 
    description: "Automobile and farm equipment manufacturer", 
    keyMetrics: { peRatio: 19, marketCap: "2T" } 
  },

  // US Tech Stocks
  { 
    name: "Apple", 
    category: "Global Stock", 
    currentPrice: 174, 
    description: "World's largest technology company by revenue", 
    keyMetrics: { peRatio: 29, marketCap: "2.8T" } 
  },
  { 
    name: "Microsoft", 
    category: "Global Stock", 
    currentPrice: 317, 
    description: "Leader in software, cloud, and AI services", 
    keyMetrics: { peRatio: 31, marketCap: "2.5T" } 
  },
  { 
    name: "Tesla", 
    category: "Global Stock", 
    currentPrice: 260, 
    description: "Electric vehicle and clean energy company", 
    keyMetrics: { peRatio: 70, marketCap: "800B" } 
  },

  // Commodities & Crypto
  { 
    name: "Gold", 
    category: "Commodity", 
    currentPrice: 59500, 
    description: "Safe-haven asset and global reserve", 
    keyMetrics: { peRatio: null, marketCap: "11T" } 
  },
  { 
    name: "Bitcoin", 
    category: "Crypto", 
    currentPrice: 2700000, 
    description: "World's first decentralized cryptocurrency", 
    keyMetrics: { peRatio: null, marketCap: "600B" } 
  },
];

const importData = async () => {
  try {
    await connectDB();
    await Product.deleteMany();
    await Product.insertMany(products);
    console.log("✅ Data Imported!");
    process.exit();
  } catch (error) {
    console.error("❌ Error seeding data:", error);
    process.exit(1);
  }
};

importData();
