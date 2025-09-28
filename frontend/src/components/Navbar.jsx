import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LogOut, LayoutDashboard, Briefcase, Flame, Star } from "lucide-react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); // <-- detect current route

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

          {/* Nav Links */}
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
                    ? "bg-yellow-500 text-black" // golden when active
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
          <div className="flex items-center">
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
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
