import { useState } from "react";
import { FiSearch, FiFilter, FiChevronDown, FiEye, FiXCircle, FiMoreVertical } from "react-icons/fi";

const Orders = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  
  const orders = [
    {
      id: 101,
      customer: "John Doe",
      total: "$230",
      status: "Processing",
      date: "2025-08-04",
      items: 3,
      payment: "Credit Card",
    },
    {
      id: 102,
      customer: "Jane Smith",
      total: "$120",
      status: "Shipped",
      date: "2025-08-03",
      items: 2,
      payment: "PayPal",
    },
    {
      id: 103,
      customer: "David Lee",
      total: "$340",
      status: "Delivered",
      date: "2025-08-01",
      items: 5,
      payment: "Credit Card",
    },
    {
      id: 104,
      customer: "Sarah Johnson",
      total: "$89",
      status: "Processing",
      date: "2025-08-05",
      items: 1,
      payment: "Apple Pay",
    },
    {
      id: 105,
      customer: "Michael Brown",
      total: "$420",
      status: "Cancelled",
      date: "2025-08-02",
      items: 4,
      payment: "Credit Card",
    },
  ];

  // Filter and sort orders
  const filteredOrders = orders
    .filter(order => 
      (order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
       order.id.toString().includes(searchTerm)) &&
      (selectedStatus === "All" || order.status === selectedStatus)
    )
    .sort((a, b) => {
      if (sortConfig.key) {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
      }
      return 0;
    });

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'ascending' ? '↑' : '↓';
  };

  const statusOptions = ["All", "Processing", "Shipped", "Delivered", "Cancelled"];

  const getStatusColor = (status) => {
    switch (status) {
      case "Processing":
        return "bg-yellow-100 text-yellow-800";
      case "Shipped":
        return "bg-blue-100 text-blue-800";
      case "Delivered":
        return "bg-green-100 text-green-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Orders</h2>
          <p className="text-gray-500 mt-1">{filteredOrders.length} orders found</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search orders..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-3">
            <div className="relative">
              <select
                className="appearance-none pl-3 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                {statusOptions.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <FiChevronDown className="text-gray-400" />
              </div>
            </div>
            
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50">
              <FiFilter />
              <span>Filter</span>
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-500">
            <tr>
              <th 
                className="px-6 py-3 text-left font-medium cursor-pointer"
                onClick={() => requestSort('id')}
              >
                <div className="flex items-center gap-1">
                  Order ID
                  <span className="text-xs">{getSortIndicator('id')}</span>
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left font-medium cursor-pointer"
                onClick={() => requestSort('customer')}
              >
                <div className="flex items-center gap-1">
                  Customer
                  <span className="text-xs">{getSortIndicator('customer')}</span>
                </div>
              </th>
              <th className="px-6 py-3 text-left font-medium">Items</th>
              <th 
                className="px-6 py-3 text-left font-medium cursor-pointer"
                onClick={() => requestSort('total')}
              >
                <div className="flex items-center gap-1">
                  Total
                  <span className="text-xs">{getSortIndicator('total')}</span>
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left font-medium cursor-pointer"
                onClick={() => requestSort('status')}
              >
                <div className="flex items-center gap-1">
                  Status
                  <span className="text-xs">{getSortIndicator('status')}</span>
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left font-medium cursor-pointer"
                onClick={() => requestSort('date')}
              >
                <div className="flex items-center gap-1">
                  Date
                  <span className="text-xs">{getSortIndicator('date')}</span>
                </div>
              </th>
              <th className="px-6 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredOrders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-800">#{order.id}</td>
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-800">{order.customer}</div>
                  <div className="text-gray-500 text-sm">{order.payment}</div>
                </td>
                <td className="px-6 py-4 text-gray-600">{order.items} items</td>
                <td className="px-6 py-4 font-medium text-gray-800">{order.total}</td>
                <td className="px-6 py-4">
                  <span 
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-600">{order.date}</td>
                <td className="px-6 py-4">
                  <div className="flex justify-end gap-2">
                    <button 
                      className="p-2 rounded-lg text-blue-600 hover:bg-blue-50"
                      title="View Order"
                    >
                      <FiEye size={18} />
                    </button>
                    {order.status === "Processing" && (
                      <button 
                        className="p-2 rounded-lg text-red-600 hover:bg-red-50"
                        title="Cancel Order"
                      >
                        <FiXCircle size={18} />
                      </button>
                    )}
                    <button className="p-2 rounded-lg text-gray-600 hover:bg-gray-100">
                      <FiMoreVertical size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-5 border-t border-gray-200">
        <div className="text-gray-500 text-sm">
          Showing 1 to {filteredOrders.length} of {filteredOrders.length} entries
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50">
            Previous
          </button>
          <button className="px-4 py-2 bg-blue-100 border border-blue-200 text-blue-600 font-medium rounded-lg">
            1
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50">
            2
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50">
            Next
          </button>
        </div>
      </div>
    </section>
  );
};

export default Orders;