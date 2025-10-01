import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/products`)
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-gray-50 to-gray-200">
      <h1 className="text-4xl font-extrabold mb-10 text-center text-gray-800">
        📈 Investment Opportunities
      </h1>

      {products.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500 animate-pulse">Loading products...</p>
        </div>
      ) : (
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <Link
  to={`/products/${p._id}`}
  key={p._id}
  className="group block bg-white/90 backdrop-blur-xl rounded-2xl border border-gray-200 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all"
>
  {/* Header */}
  <div className="p-6 flex items-center justify-between border-b border-gray-100">
    <h2 className="text-xl font-semibold text-gray-800">{p.name}</h2>
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
      p.category === "Stock" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
    }`}>
      {p.category}
    </span>
  </div>

  {/* Body */}
  <div className="p-6 space-y-2">
    <p className="text-2xl font-bold text-gray-900">
      ₹{p.pricePerUnit.toLocaleString()}
    </p>
    <p className="text-sm text-gray-500">{p.metric}</p>

    <p className={`text-sm font-semibold ${
      Math.random() > 0.5 ? "text-green-600" : "text-red-600"
    }`}>
      {Math.random() > 0.5 ? "+1.2%" : "-0.8%"} today
    </p>

    <button className="w-full mt-4 bg-indigo-600 text-white py-2 rounded-xl font-medium hover:bg-indigo-700 transition">
      View Details →
    </button>
  </div>
</Link>

          ))}
        </div>
      )}
    </div>
  );
}
