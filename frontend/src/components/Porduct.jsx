import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import * as api from "../api/api"; // ✅ use API wrapper

export default function Products() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.getProducts().then((res) => setProducts(res.data));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Available Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((p) => (
          <Link
            key={p._id}
            to={`/products/${p._id}`}
            className="p-4 bg-white shadow rounded hover:shadow-lg"
          >
            <h2 className="text-lg font-semibold">{p.name}</h2>
            <p className="text-gray-600">{p.category}</p>
            <p className="text-blue-600 font-bold">₹{p.pricePerUnit}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
