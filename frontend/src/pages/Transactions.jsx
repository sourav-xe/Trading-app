import React, { useEffect, useState } from "react";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem("token"); // JWT stored after login
        const res = await fetch("http://localhost:5000/api/transactions", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setTransactions(data);
      } catch (err) {
        console.error("Failed to fetch transactions:", err);
      }
    };

    fetchTransactions();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Your Transactions</h2>

      {transactions.length === 0 ? (
        <p className="text-gray-600">No transactions yet. Buy something!</p>
      ) : (
        <div className="overflow-x-auto shadow rounded-lg">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead>
              <tr className="bg-gray-100 text-left text-gray-700">
                <th className="px-4 py-2">Product</th>
                <th className="px-4 py-2">Category</th>
                <th className="px-4 py-2">Units</th>
                <th className="px-4 py-2">Price</th>
                <th className="px-4 py-2">Date</th>
              </tr>
            </thead>
            <tbody>
  {transactions.map((tx) => (
    <tr key={tx._id} className="border-t hover:bg-gray-50">
      <td className="px-4 py-2">{tx.product?.name || "Deleted"}</td>
      <td className="px-4 py-2">{tx.product?.category || "-"}</td>
      <td className="px-4 py-2">{tx.units}</td>
      <td className="px-4 py-2">₹{tx.pricePerUnit}</td>
      <td className="px-4 py-2">{tx.type}</td> {/* ✅ BUY / SELL */}
      <td className="px-4 py-2">
        {new Date(tx.createdAt).toLocaleString()}
      </td>
    </tr>
  ))}
</tbody>

          </table>
        </div>
      )}
    </div>
  );
};

export default Transactions;
