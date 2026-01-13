// src/components/admin/Topbar.jsx
import { useState } from "react";
import { FiSearch, FiBell, FiSettings, FiLogOut, FiMenu } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const Topbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear authentication tokens or user data
    localStorage.removeItem("authToken");
    navigate("/admin/login");
  };

  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left Section - Menu Button and Search */}
        <div className="flex items-center gap-6">
          <button className="md:hidden text-gray-600 hover:text-gray-900">
            <FiMenu size={24} />
          </button>
          
          <div className="relative hidden md:block">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Right Section - Icons and User Profile */}
        <div className="flex items-center gap-6">
          <button className="relative p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100">
            <FiBell size={20} />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          
          <button className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100">
            <FiSettings size={20} />
          </button>
          
          {/* User Profile Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 focus:outline-none"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                A
              </div>
              <span className="hidden md:inline text-gray-700 font-medium">Admin</span>
              <FiChevronDown 
                className={`text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} 
              />
            </button>
            
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-20">
                <div className="p-4 border-b border-gray-100">
                  <p className="font-medium text-gray-800">Admin User</p>
                  <p className="text-sm text-gray-500">admin@eshop.com</p>
                </div>
                <div className="py-1">
                  <button 
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-2 text-gray-700 hover:bg-gray-50"
                  >
                    <FiLogOut className="text-gray-500" />
                    <span onClick={handleLogout}>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

// Helper component for dropdown icon
const FiChevronDown = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    className={`h-5 w-5 ${className}`}
    fill="none" 
    viewBox="0 0 24 24" 
    stroke="currentColor"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

export default Topbar;