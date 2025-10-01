import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Star } from "lucide-react";
import BuyForm from "../components/BuyForm";
import {
  getProductById,
  addToWatchlist,
  removeFromWatchlist,
} from "../api/api";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const socket = io("https://trading-app-2-utd9.onrender.com");

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [inWatchlist, setInWatchlist] = useState(false);
  const [history, setHistory] = useState([]);

  // 🔽 Fetch product details
  useEffect(() => {
    getProductById(id).then((res) => {
      setProduct(res.data);
      if (res.data?.inWatchlist) setInWatchlist(true);
      setHistory([
        {
          time: new Date().toLocaleTimeString(),
          price: res.data.currentPrice,
        },
      ]);
    });
  }, [id]);

  // 🔌 Live price updates
  useEffect(() => {
    socket.on("priceUpdate", (update) => {
      if (update.productId === id) {
        setProduct((p) => ({ ...p, currentPrice: update.price }));
        setHistory((prev) => [
          ...prev.slice(-19),
          { time: new Date().toLocaleTimeString(), price: update.price },
        ]);
      }
    });
    return () => socket.off("priceUpdate");
  }, [id]);

  if (!product) return <div className="text-slate-400 p-6">Loading...</div>;

  const price = product.currentPrice || 0;

  const handleToggleWatchlist = async () => {
    try {
      if (inWatchlist) {
        await removeFromWatchlist(product._id);
        setInWatchlist(false);
        toast.success("Removed from Watchlist");
      } else {
        await addToWatchlist(product._id);
        setInWatchlist(true);
        toast.success("Added to Watchlist");
      }
    } catch {
      toast.error("Action failed");
    }
  };

  return (
    <div className="p-6 space-y-8">
      <div className="bg-slate-900/70 p-8 rounded-2xl border border-slate-800 shadow-xl">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-100">
              {product.name}
            </h2>
            <p className="text-slate-400 mt-1">{product.description}</p>
            <p className="mt-3 text-lg font-semibold text-indigo-400">
              Current Price: ₹{price.toLocaleString()}
            </p>
          </div>
          <button
            onClick={handleToggleWatchlist}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
              inWatchlist
                ? "bg-yellow-500 text-black"
                : "bg-slate-800 text-slate-300"
            }`}
          >
            <Star
              size={18}
              className={inWatchlist ? "fill-black" : "text-yellow-400"}
            />
            {inWatchlist ? "In Watchlist" : "Add to Watchlist"}
          </button>
        </div>
      </div>

      <div className="bg-slate-900/70 p-6 rounded-2xl border border-slate-800 shadow-xl">
        <h3 className="text-xl font-bold text-slate-100 mb-4">
          Live Price Trend
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={history}>
            <CartesianGrid strokeDasharray="3 3" stroke="#47556950" />
            <XAxis dataKey="time" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#6366F1"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <BuyForm product={{ ...product, price }} />
    </div>
  );
};

export default ProductDetail;
