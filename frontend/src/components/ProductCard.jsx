import { Link } from "react-router-dom";
import { ArrowUpRight, ArrowDownRight, Star } from "lucide-react";
import { AreaChart, Area, ResponsiveContainer } from "recharts";
import toast from "react-hot-toast";
import * as api from "../api/api";
import { useState } from "react";

// --- Mini Sparkline --- //
const Sparkline = ({ change }) => {
  const base = 100;
  const data = Array.from({ length: 15 }, (_, i) => ({
    value:
      base +
      (change >= 0
        ? i * 2 + Math.random() * 4 // trending upward
        : -i * 2 + Math.random() * 4), // trending downward
  }));

  const strokeColor = change >= 0 ? "#22c55e" : "#ef4444";
  const gradientId = change >= 0 ? "greenGradient" : "redGradient";

  return (
    <ResponsiveContainer width="100%" height={50}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#22c55e" stopOpacity={0.7} />
            <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="redGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.7} />
            <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="value"
          stroke={strokeColor}
          fill={`url(#${gradientId})`}
          strokeWidth={2}
          className="drop-shadow-[0_0_6px_rgba(0,0,0,0.4)]"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

// --- Product Card --- //
const ProductCard = ({ product }) => {
  const randomChange = parseFloat((Math.random() * 4 - 2).toFixed(2)); // -2% to +2%
  const [inWatchlist, setInWatchlist] = useState(false);

  // Toggle Watchlist
  const handleWatchlist = async () => {
    try {
      if (inWatchlist) {
        await api.removeFromWatchlist(product._id);
        setInWatchlist(false);
        toast.success(`${product.name} removed from watchlist.`);
      } else {
        await api.addToWatchlist(product._id);
        setInWatchlist(true);
        toast.success(`${product.name} added to watchlist!`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update watchlist.");
    }
  };

  return (
    <div className="bg-slate-900/90 p-6 rounded-2xl border border-slate-800 hover:border-indigo-500/70 hover:shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 flex flex-col group">
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-bold text-slate-50 group-hover:text-indigo-400 transition">
            {product?.name}
          </h3>
          <p className="text-sm font-medium text-indigo-400">
            {product?.category}
          </p>
        </div>
        <span
          className={`flex items-center text-sm font-semibold px-2 py-1 rounded-lg shadow-sm ${
            randomChange >= 0
              ? "bg-green-500/20 text-green-400"
              : "bg-red-500/20 text-red-400"
          }`}
        >
          {randomChange >= 0 ? (
            <ArrowUpRight size={16} className="mr-1" />
          ) : (
            <ArrowDownRight size={16} className="mr-1" />
          )}
          {randomChange}%
        </span>
      </div>

      {/* Price */}
      <p className="text-3xl font-bold text-slate-100 mb-1">
        ₹{product?.currentPrice?.toLocaleString() ?? "N/A"}
      </p>

      {/* Description */}
      <p className="text-slate-400 text-sm mb-3 line-clamp-2">
        {product?.description || "No description available"}
      </p>

      {/* Sparkline */}
      <div className="mb-4 transition-transform duration-300 group-hover:scale-105">
        <Sparkline change={randomChange} />
      </div>

      {/* Metrics */}
      <div className="flex justify-between text-xs text-slate-400 mb-5">
        <span className="px-2 py-1 rounded bg-slate-800/70">
          P/E: {product?.keyMetrics?.peRatio ?? "N/A"}
        </span>
        <span className="px-2 py-1 rounded bg-slate-800/70">
          MCAP: {product?.keyMetrics?.marketCap ?? "N/A"}
        </span>
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleWatchlist}
          className={`flex-1 flex items-center justify-center px-3 py-2 rounded-xl transition ${
            inWatchlist
              ? "bg-yellow-500 text-slate-900 font-semibold"
              : "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-indigo-400"
          }`}
        >
          <Star
            size={16}
            className={`mr-2 ${inWatchlist ? "fill-yellow-400 text-yellow-400" : ""}`}
          />
          {inWatchlist ? "Added" : "Watchlist"}
        </button>
        <Link
          to={`/product/${product._id}`}
          className="flex-1 flex items-center justify-center px-3 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold hover:from-indigo-600 hover:to-purple-600 transition"
        >
          View Details →
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
