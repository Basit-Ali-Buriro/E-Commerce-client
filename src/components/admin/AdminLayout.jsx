// src/components/admin/AdminLayout.jsx
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar with modern styling */}
      <div className="fixed inset-y-0 left-0 z-30 w-64 bg-gradient-to-b from-gray-900 to-gray-800 shadow-xl transform transition-transform duration-300 ease-in-out md:translate-x-0">
        <Sidebar />
      </div>
      
      {/* Main content area with offset for sidebar */}
      <div className="flex-1 flex flex-col ml-0 md:ml-64">
        {/* Sticky topbar with modern styling */}
        <div className="sticky top-0 z-20 bg-white border-b border-gray-200 shadow-sm">
          <Topbar />
        </div>
        
        {/* Main content with improved styling */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gradient-to-br from-gray-50 to-white">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 border border-gray-100">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;