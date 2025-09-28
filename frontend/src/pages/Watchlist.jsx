import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPortfolio, removeFromWatchlist } from "../api/api";
import toast from "react-hot-toast";
import { XCircle } from "lucide-react";

const Watchlist = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch user's watchlist
  useEffect(() => {
    const fetchWatchlist = async () => {
      try {
        const { data } = await getPortfolio();
        setWatchlist(data.watchlist || []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load watchlist.");
      } finally {
        setLoading(false);
      }
    };
    fetchWatchlist();
  }, []);

  // Handle removing from watchlist
  const handleRemove = async (productId) => {
    try {
      await removeFromWatchlist(productId);
      setWatchlist((prev) => prev.filter((p) => p._id !== productId));
      toast.success("Removed from Watchlist");
    } catch (err) {
      console.error(err);
      toast.error("Failed to remove");
    }
  };

  if (loading) return <div className="text-slate-400 p-6">Loading...</div>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-extrabold text-slate-100">Your Watchlist</h1>

      {watchlist.length === 0 ? (
        <p className="text-slate-400">No items in your watchlist.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {watchlist.map((product) => (
            <div
              key={product._id}
              className="bg-slate-900/70 backdrop-blur-xl p-6 rounded-2xl border border-slate-800 shadow-lg flex flex-col justify-between"
            >
              {/* Product Info */}
              <div>
                <h2 className="text-xl font-bold text-slate-100">
                  {product.name}
                </h2>
                <p className="text-sm text-indigo-400">{product.category}</p>
                <p className="mt-2 text-slate-300">
                  Price: ₹
                  {(product.currentPrice || product.pricePerUnit || 0).toLocaleString()}
                </p>
              </div>

              {/* Actions */}
              <div className="flex justify-between items-center mt-4">
                <Link
                  to={`/product/${product._id}`}
                  className="text-indigo-400 hover:underline text-sm font-medium"
                >
                  View Details →
                </Link>
                <button
                  onClick={() => handleRemove(product._id)}
                  className="flex items-center gap-1 px-3 py-1 rounded-lg bg-red-600/80 text-white hover:bg-red-700 transition"
                >
                  <XCircle size={16} />
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Watchlist;
