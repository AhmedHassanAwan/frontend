import React from "react";
import { useNavigate } from "react-router-dom";
import { Home, Wallet, TrendingUp, LogOut } from "lucide-react";

const Sidebar = ({ active }) => {
  const navigate = useNavigate();

  const navItems = [
    { icon: <Home size={20} />, label: "Dashboard", path: "/dashboard" },
    { icon: <TrendingUp size={20} />, label: "Income", path: "/income" },
    { icon: <Wallet size={20} />, label: "Expense", path: "/expense" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token"); 
    navigate("/"); 
  };

  return (
    <div className="h-screen w-64 bg-white shadow-lg text-black flex flex-col justify-between py-6 px-4 fixed left-0 top-0">
      <div>
        <h1 className="text-2xl font-bold mb-8 text-center text-purple-700">
          Expense Tracker
        </h1>

        <nav className="flex flex-col gap-3">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className={`flex items-center gap-3 p-3 rounded-lg text-left transition-all duration-200 w-full ${
                active === item.label.toLowerCase()
                  ? "bg-purple-100 text-purple-700 font-semibold"
                  : "hover:bg-purple-600 hover:text-white"
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="border-t border-gray-200 pt-4">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 p-3 w-full rounded-lg text-left text-red-500 hover:bg-red-100 transition-all duration-200"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
