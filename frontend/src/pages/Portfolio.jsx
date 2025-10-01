import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { sellProduct } from "../api/api";
import { Line } from "react-chartjs-2";
import { io } from "socket.io-client";
import toast from "react-hot-toast";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

const socket = io("https://trading-app-2-utd9.onrender.com");

const Portfolio = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sellModal, setSellModal] = useState({ open: false, product: null, units: 0 });
  const [livePrices, setLivePrices] = useState({});

  // Fetch portfolio
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      setLoading(true);
      setError(null);

      try {
        const token = user.token;
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/portfolio`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setData(res.data);
      } catch (err) {
        setError("Failed to load portfolio.");
        console.error("Portfolio fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  // 🔌 Listen for live price updates
  useEffect(() => {
    socket.on("priceUpdate", (update) => {
      setLivePrices((prev) => ({
        ...prev,
        [update.productId]: update.price,
      }));
    });
    return () => {
      socket.off("priceUpdate");
    };
  }, []);

  const handleSell = async () => {
    if (!sellModal.product || sellModal.units <= 0) {
      toast.error("Invalid sell request");
      return;
    }

    try {
      await sellProduct({
        productId: sellModal.product._id,
        units: sellModal.units,
      });
      toast.success("✅ Sold successfully!");
      setSellModal({ open: false, product: null, units: 0 });

      // Refresh portfolio after selling
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/portfolio`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setData(res.data);
    } catch (err) {
      toast.error("❌ Sell failed");
      console.error(err);
    }
  };

  if (!user) return <div className="text-red-500">🔑 Please login</div>;
  if (loading) return <div className="animate-pulse text-slate-400">Loading portfolio...</div>;
  if (error) return <div className="text-red-400">{error}</div>;
  if (!data) return null;

  // Chart data (live portfolio value trend)
  const chartData = {
    labels: data.holdings.map((h) => h.product?.name || "Unknown"),
    datasets: [
      {
        label: "Current Value",
        data: data.holdings.map(
          (h) =>
            (livePrices[h.product?._id] || h.currentPrice) *
            h.units
        ),
        borderColor: "#22c55e",
        backgroundColor: "rgba(34,197,94,0.15)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  return (
    <div className="p-6 bg-gradient-to-b from-slate-900 to-slate-800 min-h-screen text-slate-100">
      <h2 className="text-3xl font-extrabold mb-6 flex items-center gap-2 animate-fadeIn">
        📊 <span>My Portfolio</span>
      </h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <SummaryCard label="Wallet Balance" value={data.wallet} />
        <SummaryCard label="Total Invested" value={data.totalInvested} />
        <SummaryCard label="Current Value" value={data.currentValue} />
        <SummaryCard label="Returns" value={data.totalReturns} isReturn />
      </div>

      {/* Portfolio Chart */}
      <div className="bg-slate-800/90 p-6 rounded-xl shadow-2xl mb-10 border border-slate-700 hover:shadow-green-500/30 transition duration-300">
        <h3 className="text-xl font-semibold mb-4">📈 Portfolio Performance</h3>
        <div className="h-64">
          <Line data={chartData} options={{ maintainAspectRatio: false }} />
        </div>
      </div>

      {/* Holdings Table */}
      <h3 className="text-2xl font-semibold mb-4">Your Holdings</h3>
      {data.holdings.length === 0 ? (
        <p className="text-slate-400 italic">You don’t have any holdings yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl shadow-lg border border-slate-700 hover:shadow-indigo-500/30 transition duration-300">
          <table className="min-w-full bg-slate-800/90">
            <thead>
              <tr className="bg-slate-700 text-slate-300 text-left">
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Units</th>
                <th className="py-3 px-4">Avg Price</th>
                <th className="py-3 px-4">Invested</th>
                <th className="py-3 px-4">Current Price</th>
                <th className="py-3 px-4">Current Value</th>
                <th className="py-3 px-4">Returns</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.holdings.map((h, i) => {
                const livePrice = livePrices[h.product?._id] || h.currentPrice;
                const liveValue = livePrice * h.units;
                const liveReturns = liveValue - h.invested;

                return (
                  <tr
                    key={i}
                    className="border-t border-slate-700 hover:bg-slate-700/40 transition duration-300"
                  >
                    <td className="py-3 px-4 font-semibold">{h.product?.name || "❌ Deleted Product"}</td>
                    <td className="py-3 px-4">
                      {h.product ? (
                        <span className="px-2 py-1 text-xs rounded bg-slate-600 text-slate-200">
                          {h.product.category}
                        </span>
                      ) : "-"}
                    </td>
                    <td className="py-3 px-4">{h.units}</td>
                    <td className="py-3 px-4">₹{Number(h.avgPrice).toFixed(2)}</td>
                    <td className="py-3 px-4">₹{Number(h.invested).toFixed(2)}</td>
                    <td className="py-3 px-4">₹{livePrice.toFixed(2)}</td>
                    <td className="py-3 px-4">₹{liveValue.toFixed(2)}</td>
                    <td
                      className={`py-3 px-4 font-semibold ${
                        liveReturns >= 0 ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {liveReturns >= 0 ? "+" : ""}₹{liveReturns.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {h.product && h.units > 0 && (
                        <button
                          onClick={() => setSellModal({ open: true, product: h.product, units: h.units })}
                          className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded shadow hover:shadow-red-500/40 transition"
                        >
                          Sell
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Sell Modal */}
      {sellModal.open && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-slate-800 p-6 rounded-xl shadow-lg w-96 animate-fadeIn">
            <h2 className="text-xl font-bold mb-4 text-white">Sell {sellModal.product?.name}</h2>
            <input
              type="number"
              min="1"
              max={sellModal.units}
              value={sellModal.units}
              onChange={(e) => setSellModal({ ...sellModal, units: Number(e.target.value) })}
              className="w-full p-2 mb-4 rounded bg-slate-700 text-white"
            />
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setSellModal({ open: false, product: null, units: 0 })}
                className="px-4 py-2 bg-slate-600 hover:bg-slate-700 rounded text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleSell}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded text-white shadow hover:shadow-red-500/40"
              >
                Confirm Sell
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Summary cards
const SummaryCard = ({ label, value, isReturn }) => (
  <div className="bg-slate-800/90 rounded-xl p-5 shadow-md hover:shadow-indigo-500/40 transition duration-300 transform hover:-translate-y-1">
    <p className="text-slate-400 text-sm">{label}</p>
    <h3
      className={`text-2xl font-bold ${
        isReturn ? (value >= 0 ? "text-green-400" : "text-red-400") : "text-slate-100"
      }`}
    >
      ₹{Number(value).toFixed(2)}
    </h3>
  </div>
);

export default Portfolio;
