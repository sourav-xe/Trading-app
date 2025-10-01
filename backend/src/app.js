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

app.use(cors({
  origin: [
    "https://trading-app-pam4.vercel.app" // your deployed frontend
  ],
  credentials: true,
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
