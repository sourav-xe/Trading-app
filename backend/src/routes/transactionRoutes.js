import express from "express";
import { buyProduct, getTransactions } from "../controllers/transactionController.js";
import { protect } from "../middlewares/authMiddleware.js";
const router = express.Router();
router.post("/buy", protect, buyProduct);
router.get("/", protect, getTransactions);
export default router;
