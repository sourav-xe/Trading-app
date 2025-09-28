import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LogOut,
  LayoutDashboard,
  Briefcase,
  Flame,
  Star,
  Menu,
} from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 text-white">
              <Flame className="h-8 w-8 text-indigo-400" />
              <span className="font-bold text-xl">TradeApp</span>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link
                to="/"
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  location.pathname === "/"
                    ? "bg-indigo-600 text-white"
                    : "text-slate-300 hover:bg-slate-700 hover:text-white"
                }`}
              >
                <LayoutDashboard size={16} className="mr-2" />
                Dashboard
              </Link>

              <Link
                to="/portfolio"
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  location.pathname === "/portfolio"
                    ? "bg-indigo-600 text-white"
                    : "text-slate-300 hover:bg-slate-700 hover:text-white"
                }`}
              >
                <Briefcase size={16} className="mr-2" />
                Portfolio
              </Link>

              <Link
                to="/watchlist"
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  location.pathname === "/watchlist"
                    ? "bg-yellow-500 text-black"
                    : "text-slate-300 hover:bg-slate-700 hover:text-white"
                }`}
              >
                <Star
                  size={16}
                  className={`mr-2 ${
                    location.pathname === "/watchlist"
                      ? "text-black"
                      : "text-yellow-400"
                  }`}
                />
                Watchlist
              </Link>
            </div>
          </div>

          {/* Right Side (User + Logout) */}
          <div className="hidden md:flex items-center">
            <span className="text-slate-300 mr-4 text-sm font-medium">
              {user?.name}
            </span>
            <button
              onClick={handleLogout}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-full flex items-center space-x-2 transition"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(true)}
              className="text-slate-300 hover:text-white"
            >
              <Menu size={28} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/60 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 80, damping: 20 }}
              className="fixed top-0 right-0 w-72 sm:w-80 h-full bg-slate-900/80 backdrop-blur-xl border-l border-slate-700 z-50 shadow-2xl flex flex-col p-6"
            >
              {/* Close */}
              <button
                onClick={() => setIsOpen(false)}
                className="self-end mb-6 text-slate-400 hover:text-white text-2xl"
              >
                ✕
              </button>

              {/* Links */}
              <nav className="flex flex-col space-y-4">
                <Link
                  to="/"
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition ${
                    location.pathname === "/"
                      ? "bg-indigo-600 text-white"
                      : "text-slate-300 hover:bg-slate-700 hover:text-white"
                  }`}
                >
                  <LayoutDashboard size={18} className="mr-2" />
                  Dashboard
                </Link>

                <Link
                  to="/portfolio"
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition ${
                    location.pathname === "/portfolio"
                      ? "bg-indigo-600 text-white"
                      : "text-slate-300 hover:bg-slate-700 hover:text-white"
                  }`}
                >
                  <Briefcase size={18} className="mr-2" />
                  Portfolio
                </Link>

                <Link
                  to="/watchlist"
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition ${
                    location.pathname === "/watchlist"
                      ? "bg-yellow-500 text-black"
                      : "text-slate-300 hover:bg-slate-700 hover:text-white"
                  }`}
                >
                  <Star
                    size={18}
                    className={`mr-2 ${
                      location.pathname === "/watchlist"
                        ? "text-black"
                        : "text-yellow-400"
                    }`}
                  />
                  Watchlist
                </Link>
              </nav>

              {/* User Info + Logout */}
              <div className="mt-auto pt-6 border-t border-slate-700">
                <p className="text-slate-300 mb-4">{user?.name}</p>
                <button
                  onClick={handleLogout}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center space-x-2 transition"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
