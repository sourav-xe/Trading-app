import User from "../models/User.js";
import Product from "../models/Product.js";
import Transaction from "../models/Transaction.js";
import mongoose from "mongoose";

export const buyProduct = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, units } = req.body;

    const buyUnits = Number(units);
    if (!productId || isNaN(buyUnits) || buyUnits <= 0) {
      return res.status(400).json({ message: "Invalid input" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // ✅ use currentPrice, not price
    const pricePerUnit = Number(product.currentPrice);
    if (isNaN(pricePerUnit)) {
      return res.status(400).json({ message: "Invalid product price" });
    }

    const total = pricePerUnit * buyUnits;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.wallet < total) {
      return res.status(400).json({ message: "Insufficient wallet balance" });
    }

    // ✅ Perform updates in a transaction
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      // Deduct wallet
      user.wallet = Number(user.wallet) - total;

      // Update holdings
      const holdingIndex = user.holdings.findIndex(
        (h) => h.product.toString() === productId
      );

      if (holdingIndex > -1) {
        // Existing holding
        const holding = user.holdings[holdingIndex];
        const newUnits = Number(holding.units) + buyUnits;
        const newInvested = Number(holding.invested) + total;
        const newAvgPrice = newInvested / newUnits;

        user.holdings[holdingIndex].units = newUnits;
        user.holdings[holdingIndex].invested = newInvested;
        user.holdings[holdingIndex].avgPrice = newAvgPrice;
      } else {
        // New holding
        user.holdings.push({
          product: product._id,
          units: buyUnits,
          avgPrice: pricePerUnit,
          invested: total,
        });
      }

      await user.save({ session });

      // Create transaction record
      const [tx] = await Transaction.create(
        [
          {
            user: user._id,
            product: product._id,
            units: buyUnits,
            pricePerUnit,
            total,
            type: "BUY",
          },
        ],
        { session }
      );

      await session.commitTransaction();
      session.endSession();

      res
        .status(201)
        .json({ message: "Purchase successful", tx, wallet: user.wallet });
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      throw err;
    }
  } catch (error) {
    console.error("BUY ERROR:", error);
    res
      .status(500)
      .json({ message: "Server error during buy", error: error.message });
  }
};

export const getTransactions = async (req, res) => {
  try {
    const userId = req.user._id;
    const txs = await Transaction.find({ user: userId }).populate("product");
    res.json(txs);
  } catch (error) {
    console.error("GET TX ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};
