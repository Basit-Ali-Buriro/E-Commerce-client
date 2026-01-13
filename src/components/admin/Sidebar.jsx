// src/components/admin/Sidebar.jsx
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  FiHome, 
  FiBox, 
  FiShoppingCart, 
  FiPlusCircle,
  FiSettings,
  FiUsers,
  FiBarChart2,
  FiLogOut,
  FiMenu,
  FiX
} from "react-icons/fi";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  const links = [
    { to: "/admin/dashboard", icon: <FiHome size={20} />, label: "Dashboard" },
    { to: "/admin/products", icon: <FiBox size={20} />, label: "Products" },
    { to: "/admin/create-product", icon: <FiPlusCircle size={20} />, label: "Create Product" },
    { to: "/admin/orders", icon: <FiShoppingCart size={20} />, label: "Orders" },
    { to: "/admin/customers", icon: <FiUsers size={20} />, label: "Customers" },
    { to: "/admin/analytics", icon: <FiBarChart2 size={20} />, label: "Analytics" },
  ];

  const settingsLinks = [
    { to: "/admin/settings", icon: <FiSettings size={20} />, label: "Settings" },
  ];

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between bg-gray-900 text-white p-4 shadow-md">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 w-8 h-8 rounded-lg flex items-center justify-center">
            <FiBox className="text-white" size={20} />
          </div>
          <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            E-Shop Admin
          </h2>
        </div>
        <button onClick={() => setIsOpen(!isOpen)} className="text-gray-300 hover:text-white">
          {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>
     
      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-5 shadow-xl transition-transform duration-300 ease-in-out transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0`}
      >
        {/* Logo/Branding */}
        <div className="flex items-center justify-center gap-3 mb-10 pt-4">
          <div className="bg-blue-600 w-10 h-10 rounded-lg flex items-center justify-center">
            <FiBox className="text-white" size={24} />
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            E-Shop Admin
          </h2>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1 mb-8">
          {links.map(({ to, icon, label }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-4 py-3 px-4 rounded-lg transition-all duration-300 ${
                isActive(to) 
                  ? "bg-blue-600/20 border-l-4 border-blue-500 text-white font-medium"
                  : "text-gray-300 hover:bg-gray-700/50 hover:text-white"
              }`}
            >
              <span className={`${isActive(to) ? "text-blue-400" : "text-gray-400"}`}>
                {icon}
              </span>
              <span>{label}</span>
            </Link>
          ))}
        </nav>

        {/* Settings Section */}
        <div className="border-t border-gray-700/50 pt-4 mb-6">
          <h3 className="text-xs uppercase text-gray-400 tracking-wider px-4 mb-2">
            Settings
          </h3>
          <nav className="space-y-1">
            {settingsLinks.map(({ to, icon, label }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-4 py-3 px-4 rounded-lg transition-all ${
                  isActive(to)
                    ? "bg-gray-800 text-white"
                    : "text-gray-300 hover:bg-gray-700/50 hover:text-white"
                }`}
              >
                {icon}
                <span>{label}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="absolute bottom-0 left-0 w-full p-5 border-t border-gray-700/50">
          <button className="w-full flex items-center gap-3 py-3 px-4 rounded-lg text-gray-300 hover:bg-gray-700/50 hover:text-white transition-colors">
            <FiLogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
};

export default Sidebar;