import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import * as api from "../api/api"; // ✅ use API wrapper

const BuyForm = ({ product }) => {
  const { user } = useAuth();
  const [units, setUnits] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleBuy = async (e) => {
    e.preventDefault();
    if (!user) return alert("Please login");
    try {
      setLoading(true);
      await api.buyProduct({
        productId: product._id,
        units: Number(units),
      });
      alert("Purchased!");
    } catch (err) {
      alert(err.response?.data?.message || "Buy failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleBuy}
      className="mt-6 flex items-center gap-3 bg-slate-800 p-4 rounded-xl shadow-lg"
    >
      <div className="flex flex-col flex-1">
        <label className="text-sm text-slate-300 mb-1">Units</label>
        <input
          type="number"
          min="1"
          value={units}
          onChange={(e) => setUnits(e.target.value)}
          className="px-3 py-2 rounded-lg border border-slate-600 bg-slate-900 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      <button
        disabled={loading}
        type="submit"
        className="px-5 py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition disabled:opacity-50"
      >
        {loading ? "Buying..." : `Buy @ ₹${product.price}`}
      </button>
    </form>
  );
};

export default BuyForm;
