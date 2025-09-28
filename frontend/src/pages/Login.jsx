import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiLogIn } from "react-icons/fi";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await login(form.email, form.password);
      navigate("/"); // redirect after success
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      {/* Animated glowing blobs */}
      <motion.div
        animate={{ x: [0, 40, -40, 0], y: [0, -40, 40, 0] }}
        transition={{ repeat: Infinity, duration: 12 }}
        className="absolute w-64 h-64 bg-indigo-600 rounded-full opacity-25 blur-3xl top-16 left-16"
      />
      <motion.div
        animate={{ x: [0, -50, 50, 0], y: [0, 50, -50, 0] }}
        transition={{ repeat: Infinity, duration: 15 }}
        className="absolute w-64 h-64 bg-purple-600 rounded-full opacity-25 blur-3xl bottom-16 right-16"
      />

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-sm p-8 bg-slate-900/70 backdrop-blur-lg rounded-2xl shadow-xl border border-slate-700"
      >
        <h2 className="text-3xl font-extrabold mb-6 text-center text-indigo-400 drop-shadow-md">
          Welcome Back
        </h2>

        {error && (
          <p className="text-red-500 text-sm mb-3 text-center">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0px 0px 15px #6366f1" }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full py-3 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 rounded-xl font-semibold transition"
          >
            <FiLogIn className="text-lg" />
            Login
          </motion.button>
        </form>

        <p className="text-center text-sm text-slate-400 mt-4">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-indigo-400 hover:underline">
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
