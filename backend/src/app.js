import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import portfolioRoutes from "./routes/portfolioRoutes.js";




const app = express();

// If uploads dir doesn't exist create it (safety)
const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

// Middlewares
app.use(express.json());

// Allow requests from your frontend (adjust origin as needed)
app.use(cors({
  origin: "http://localhost:3000", // your React dev server
  // origin: "*" // dev option if you prefer
}));

// serve static files in uploads
app.use("/uploads", express.static(uploadsDir));

// after your other app.use middlewares
app.use("/api/products", productRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/portfolio", portfolioRoutes);
// routes
app.use("/api/auth", authRoutes);

export default app;
