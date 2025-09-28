import User from "../models/User.js";
import Product from "../models/Product.js";

export const getPortfolio = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate("holdings.product")
      .populate("watchlist");

    if (!user) return res.status(404).json({ message: "User not found" });

    const holdings = user.holdings.map((h) => {
      if (!h.product) {
        return {
          product: null,
          units: h.units,
          invested: h.invested,
          avgPrice: h.avgPrice,
          currentPrice: 0,
          currentValue: 0,
          returns: 0,
        };
      }

      const currentPrice =
        h.product.currentPrice ?? h.product.price ?? 0;

      const currentValue = h.units * currentPrice;
      const returns = currentValue - h.invested;

      return {
        product: h.product,
        units: h.units,
        invested: h.invested,
        avgPrice: h.avgPrice,
        currentPrice,
        currentValue,
        returns,
      };
    });

    const totalInvested = holdings.reduce((s, h) => s + h.invested, 0);
    const currentValue = holdings.reduce((s, h) => s + h.currentValue, 0);
    const totalReturns = currentValue - totalInvested;

    res.json({
      wallet: user.wallet,
      holdings,
      totalInvested,
      currentValue,
      totalReturns,
      watchlist: user.watchlist,
    });
  } catch (error) {
    console.error("GET PORTFOLIO ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export const addToWatchlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const { productId } = req.body;
    if (!productId) return res.status(400).json({ message: "productId required" });
    if (user.watchlist.includes(productId)) return res.status(400).json({ message: "Already in watchlist" });

    user.watchlist.push(productId);
    await user.save();
    res.json({ message: "Added to watchlist" });
  } catch (error) {
    console.error("ADD WATCHLIST ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const removeFromWatchlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const { productId } = req.body;
    user.watchlist = user.watchlist.filter(p => p.toString() !== productId);
    await user.save();
    res.json({ message: "Removed from watchlist" });
  } catch (error) {
    console.error("REMOVE WATCHLIST ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};
