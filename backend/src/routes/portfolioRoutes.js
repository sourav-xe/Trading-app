import express from "express";
import { getPortfolio, addToWatchlist, removeFromWatchlist } from "../controllers/portfolioController.js";
import { protect } from "../middlewares/authMiddleware.js";
const router = express.Router();
router.get("/", protect, getPortfolio);
router.post("/watchlist/add", protect, addToWatchlist);
router.post("/watchlist/remove", protect, removeFromWatchlist);
export default router;
