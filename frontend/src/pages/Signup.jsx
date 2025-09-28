import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiUploadCloud } from "react-icons/fi";

const Signup = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    panNumber: "",
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("email", form.email);
    formData.append("password", form.password);
    formData.append("panNumber", form.panNumber);
    if (file) formData.append("idImage", file);

    try {
      await signup(formData);
      navigate("/");
    } catch (err) {
      alert(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      {/* Animated glowing background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ x: [0, 40, -40, 0], y: [0, -40, 40, 0] }}
          transition={{ repeat: Infinity, duration: 10 }}
          className="absolute w-72 h-72 bg-indigo-600 rounded-full opacity-30 blur-3xl top-20 left-20"
        />
        <motion.div
          animate={{ x: [0, -50, 50, 0], y: [0, 50, -50, 0] }}
          transition={{ repeat: Infinity, duration: 12 }}
          className="absolute w-72 h-72 bg-purple-600 rounded-full opacity-30 blur-3xl bottom-20 right-20"
        />
      </div>

      {/* Signup Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-md p-8 bg-slate-900/70 backdrop-blur-lg rounded-2xl shadow-2xl border border-slate-700"
      >
        {/* App Branding */}
        <div className="text-center mb-6">
          <motion.div
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ repeat: Infinity, duration: 6 }}
            className="text-indigo-400 text-4xl"
          >
            📈
          </motion.div>
          <h2 className="text-3xl font-extrabold text-white mt-2">
            Create your account
          </h2>
          <p className="text-slate-400 text-sm">
            Join and start trading smarter 🚀
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
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
          <input
            name="panNumber"
            placeholder="PAN Number"
            value={form.panNumber}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          {/* File Upload */}
          <label className="flex items-center justify-center w-full p-4 border-2 border-dashed border-slate-600 rounded-xl cursor-pointer bg-slate-800 hover:border-indigo-500 transition">
            <FiUploadCloud className="text-indigo-400 text-2xl mr-2" />
            <span className="text-slate-400">
              {file ? file.name : "Upload Dummy ID"}
            </span>
            <input
              type="file"
              accept=".jpg,.jpeg,.png,.pdf"
              onChange={(e) => setFile(e.target.files[0])}
              className="hidden"
              required
            />
          </label>

          {/* Submit */}
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0px 0px 15px #6366f1" }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition"
          >
            {loading ? "Creating..." : "Create Account"}
          </motion.button>
        </form>

        <p className="text-center text-sm text-slate-400 mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-400 hover:underline">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;
