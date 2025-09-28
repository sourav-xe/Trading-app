import { useEffect, useState } from "react";
import * as api from "../api/api";
import toast from "react-hot-toast";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

import {
  AreaChart,
  Area,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import ProductCard from "../components/ProductCard";
import {
  FaWallet,
  FaExchangeAlt,
  FaChartLine,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";
import { io } from "socket.io-client";


// Map of symbol → coingecko id
const SYMBOL_TO_ID = {
  BTC: "bitcoin",
  ETH: "ethereum",
  SOL: "solana",
  ADA: "cardano",
  BNB: "binancecoin",
};

const socket = io("http://localhost:5000");
const Dashboard = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tickerData, setTickerData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categories, setCategories] = useState(["All"]);

  // Portfolio data
  const [portfolio, setPortfolio] = useState(null);

  // Chart data
  const [balanceData, setBalanceData] = useState([]);
  const [pnlData, setPnlData] = useState([]);

  useEffect(() => {
  socket.on("priceUpdate", (update) => {
    setProducts((prev) =>
      prev.map((p) =>
        p._id === update.productId ? { ...p, currentPrice: update.price } : p
      )
    );
  });
  return () => socket.off("priceUpdate");
}, []);

  useEffect(() => {
    const fetchPortfolio = async () => {
      if (!user) return;
      try {
        const res = await axios.get("http://localhost:5000/api/portfolio", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setPortfolio(res.data);

        // Build balance chart from portfolio values (simple approximation)
        const history = [
          { date: "Start", balance: res.data.totalInvested * 0.9 },
          { date: "Invested", balance: res.data.totalInvested },
          { date: "Now", balance: res.data.currentValue },
        ];
        setBalanceData(history);

        // Build PnL bars from holdings
        const pnlArr = res.data.holdings.map((h, i) => ({
          trade: h.product ? h.product.name : `Asset-${i + 1}`,
          pnl: h.returns,
        }));
        setPnlData(pnlArr);
      } catch (err) {
        toast.error("Failed to fetch portfolio data.");
        console.error(err);
      }
    };

    const fetchProducts = async () => {
      try {
        const { data } = await api.getProducts();
        setProducts(data || []);
        const uniqueCategories = [
          "All",
          ...new Set((data || []).map((p) => p.category)),
        ];
        setCategories(uniqueCategories);
      } catch (error) {
        toast.error("Failed to fetch products.");
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
    fetchProducts();
  }, [user]);

  // Fetch live crypto prices
  useEffect(() => {
    const fetchTicker = async () => {
      try {
        const ids = Object.values(SYMBOL_TO_ID).join(",");
        const vs = "usd";
        const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=${vs}&include_24hr_change=true`;
        const resp = await fetch(url);
        const json = await resp.json();
        const arr = Object.entries(SYMBOL_TO_ID).map(([symbol, id]) => {
          const info = json[id];
          return {
            symbol,
            price: info?.usd ?? 0,
            change: info?.usd_24h_change ?? 0,
          };
        });
        setTickerData(arr);
      } catch (err) {
        console.error("Ticker fetch error:", err);
      }
    };

    fetchTicker();
    const interval = setInterval(fetchTicker, 20000);
    return () => clearInterval(interval);
  }, []);

  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  if (!user)
    return (
      <div className="text-red-500 p-6">🔑 Please login to view Dashboard</div>
    );

  if (loading || !portfolio)
    return <div className="text-slate-400 p-6">Loading...</div>;

  // Tooltip for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800 p-3 rounded-lg border border-slate-700 shadow-lg">
          <p className="text-slate-300 font-semibold">{label}</p>
          <p
            className={`text-sm ${
              payload[0].value >= 0 ? "text-green-400" : "text-red-400"
            }`}
          >
            {`${payload[0].name}: ${payload[0].value.toLocaleString()}`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 bg-slate-950 min-h-screen text-slate-50">
      {/* Live Ticker */}
      <div className="relative overflow-hidden bg-slate-900 rounded-lg border border-slate-800">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-transparent to-slate-900 w-12 pointer-events-none z-10"></div>
        <div className="absolute right-0 inset-y-0 bg-gradient-to-l from-slate-900 via-transparent to-slate-900 w-12 pointer-events-none z-10"></div>
        <div className="animate-marquee flex space-x-12 py-3">
          {tickerData.map((t, idx) => (
            <div key={idx} className="flex items-center space-x-3 text-sm">
              <span className="font-bold">{t.symbol}</span>
              <span className="text-slate-400">
                ${t.price.toLocaleString()}
              </span>
              <span
                className={`flex items-center font-semibold ${
                  t.change >= 0 ? "text-green-400" : "text-red-400"
                }`}
              >
                {t.change >= 0 ? (
                  <FaArrowUp className="mr-1" />
                ) : (
                  <FaArrowDown className="mr-1" />
                )}
                {t.change.toFixed(2)}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Heading */}
      <h1 className="text-3xl md:text-4xl font-bold">Dashboard</h1>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <SummaryCard
          icon={<FaWallet className="text-green-400" />}
          title="Wallet Balance"
          value={`₹${portfolio.wallet.toLocaleString()}`}
          color="text-green-400"
        />
        <SummaryCard
          icon={<FaExchangeAlt className="text-indigo-400" />}
          title="Total Invested"
          value={`₹${portfolio.totalInvested.toLocaleString()}`}
          color="text-indigo-400"
        />
        <SummaryCard
          icon={<FaChartLine className="text-blue-400" />}
          title="Current Value"
          value={`₹${portfolio.currentValue.toLocaleString()}`}
          color="text-blue-400"
        />
        <SummaryCard
          icon={
            <FaChartLine
              className={
                portfolio.totalReturns >= 0 ? "text-green-400" : "text-red-400"
              }
            />
          }
          title="Total Returns"
          value={`₹${portfolio.totalReturns.toLocaleString()}`}
          color={
            portfolio.totalReturns >= 0 ? "text-green-400" : "text-red-400"
          }
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ChartCard title="Account Balance History">
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={balanceData}>
              <defs>
                <linearGradient
                  id="balanceGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis
                dataKey="date"
                stroke="#94a3b8"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#94a3b8"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `₹${value / 1000}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="balance"
                stroke="#22c55e"
                fill="url(#balanceGradient)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

       <ChartCard title="Market Overview (Demo)">
  <ResponsiveContainer width="100%" height={250}>
    <AreaChart
      data={[
        { day: "Mon", value: 4200 },
        { day: "Tue", value: 4600 },
        { day: "Wed", value: 4800 },
        { day: "Thu", value: 4700 },
        { day: "Fri", value: 5100 },
        { day: "Sat", value: 5300 },
        { day: "Sun", value: 5500 },
      ]}
    >
      <defs>
        <linearGradient id="marketGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
        </linearGradient>
      </defs>
      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
      <XAxis dataKey="day" stroke="#94a3b8" />
      <YAxis stroke="#94a3b8" tickFormatter={(v) => `₹${v / 1000}k`} />
      <Tooltip />
      <Area
        type="monotone"
        dataKey="value"
        stroke="#3b82f6"
        fill="url(#marketGradient)"
        strokeWidth={2}
      />
    </AreaChart>
  </ResponsiveContainer>
</ChartCard>

      </div>

      {/* Marketplace */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Marketplace</h2>
        <div className="flex flex-wrap gap-3 mb-6">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                selectedCategory === cat
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        {filteredProducts.length === 0 ? (
          <p className="text-slate-400">No products available.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// --- Helpers ---
const SummaryCard = ({ icon, title, value, color }) => (
  <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 flex items-center space-x-4">
    <div className="text-2xl p-3 bg-slate-800 rounded-full">{icon}</div>
    <div>
      <p className="text-slate-400 text-sm">{title}</p>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
    </div>
  </div>
);

const ChartCard = ({ title, children }) => (
  <div className="bg-slate-900 p-4 sm:p-6 rounded-xl border border-slate-800">
    <h3 className="text-lg font-bold text-slate-100 mb-4">{title}</h3>
    {children}
  </div>
);

export default Dashboard;
