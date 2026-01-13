import React, { useState, useEffect } from 'react';
import { Search, Filter, User, Mail, Phone, ShoppingBag, DollarSign, MoreVertical, Edit, Trash2, Plus, ChevronDown, ChevronUp } from 'react-feather';

const Customer = () => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [expandedCustomer, setExpandedCustomer] = useState(null);
  
  // Mock customer data
  useEffect(() => {
    const mockCustomers = [
      {
        id: 1,
        name: "Sarah Johnson",
        email: "sarah@example.com",
        phone: "(555) 123-4567",
        joinDate: "2023-01-15",
        totalOrders: 24,
        totalSpent: 1845.50,
        status: "active",
        location: "New York, NY",
        lastOrder: "2023-10-22"
      },
      {
        id: 2,
        name: "Michael Chen",
        email: "michael@example.com",
        phone: "(555) 987-6543",
        joinDate: "2022-11-03",
        totalOrders: 42,
        totalSpent: 3210.75,
        status: "active",
        location: "San Francisco, CA",
        lastOrder: "2023-10-20"
      },
      {
        id: 3,
        name: "Emma Rodriguez",
        email: "emma@example.com",
        phone: "(555) 456-7890",
        joinDate: "2023-03-22",
        totalOrders: 12,
        totalSpent: 875.25,
        status: "inactive",
        location: "Miami, FL",
        lastOrder: "2023-09-15"
      },
      {
        id: 4,
        name: "David Wilson",
        email: "david@example.com",
        phone: "(555) 234-5678",
        joinDate: "2022-08-10",
        totalOrders: 37,
        totalSpent: 2940.00,
        status: "active",
        location: "Chicago, IL",
        lastOrder: "2023-10-21"
      },
      {
        id: 5,
        name: "Olivia Thompson",
        email: "olivia@example.com",
        phone: "(555) 876-5432",
        joinDate: "2023-05-18",
        totalOrders: 8,
        totalSpent: 620.50,
        status: "inactive",
        location: "Seattle, WA",
        lastOrder: "2023-08-30"
      },
      {
        id: 6,
        name: "James Miller",
        email: "james@example.com",
        phone: "(555) 345-6789",
        joinDate: "2022-12-05",
        totalOrders: 31,
        totalSpent: 2150.25,
        status: "active",
        location: "Boston, MA",
        lastOrder: "2023-10-19"
      }
    ];
    
    setCustomers(mockCustomers);
    setFilteredCustomers(mockCustomers);
  }, []);
  
  // Filter and search functionality
  useEffect(() => {
    let result = customers;
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(customer => 
        customer.name.toLowerCase().includes(term) || 
        customer.email.toLowerCase().includes(term) || 
        customer.phone.includes(term) ||
        customer.location.toLowerCase().includes(term)
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(customer => customer.status === statusFilter);
    }
    
    // Apply sorting
    if (sortBy === 'recent') {
      result = [...result].sort((a, b) => new Date(b.joinDate) - new Date(a.joinDate));
    } else if (sortBy === 'name') {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'orders') {
      result = [...result].sort((a, b) => b.totalOrders - a.totalOrders);
    } else if (sortBy === 'spent') {
      result = [...result].sort((a, b) => b.totalSpent - a.totalSpent);
    }
    
    setFilteredCustomers(result);
  }, [searchTerm, statusFilter, sortBy, customers]);
  
  const toggleCustomerExpansion = (id) => {
    if (expandedCustomer === id) {
      setExpandedCustomer(null);
    } else {
      setExpandedCustomer(id);
    }
  };
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Customer Management</h1>
            <p className="text-gray-600 mt-2">Manage and analyze your customer base</p>
          </div>
          <button className="mt-4 md:mt-0 flex items-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
            <Plus className="mr-2" size={18} />
            Add New Customer
          </button>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="text-gray-500 text-sm font-medium">Total Customers</div>
            <div className="text-3xl font-bold text-gray-800 mt-2">6,245</div>
            <div className="text-green-500 text-sm mt-1 flex items-center">
              <span>↑ 12.5%</span>
              <span className="ml-1">from last month</span>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="text-gray-500 text-sm font-medium">Active Customers</div>
            <div className="text-3xl font-bold text-gray-800 mt-2">4,892</div>
            <div className="text-green-500 text-sm mt-1">78.3% of total</div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="text-gray-500 text-sm font-medium">Avg. Orders</div>
            <div className="text-3xl font-bold text-gray-800 mt-2">5.2</div>
            <div className="text-gray-500 text-sm mt-1">per customer</div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="text-gray-500 text-sm font-medium">Avg. Lifetime Value</div>
            <div className="text-3xl font-bold text-gray-800 mt-2">{formatCurrency(1245.75)}</div>
            <div className="text-green-500 text-sm mt-1 flex items-center">
              <span>↑ 8.2%</span>
              <span className="ml-1">YoY</span>
            </div>
          </div>
        </div>
        
        {/* Controls */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div className="relative w-full md:w-1/3 mb-4 md:mb-0">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="text-gray-400" size={18} />
              </div>
              <input
                type="text"
                placeholder="Search customers..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center">
                <span className="text-gray-600 mr-2">Status:</span>
                <select 
                  className="border border-gray-300 rounded-lg py-2 px-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              
              <div className="flex items-center">
                <span className="text-gray-600 mr-2">Sort by:</span>
                <select 
                  className="border border-gray-300 rounded-lg py-2 px-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="recent">Most Recent</option>
                  <option value="name">Name</option>
                  <option value="orders">Orders</option>
                  <option value="spent">Total Spent</option>
                </select>
              </div>
              
              <button className="flex items-center text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg py-2 px-3">
                <Filter className="mr-2" size={16} />
                More Filters
              </button>
            </div>
          </div>
        </div>
        
        {/* Customer Cards */}
        <div className="grid grid-cols-1 gap-6">
          {filteredCustomers.map(customer => (
            <div 
              key={customer.id} 
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300"
            >
              <div 
                className={`p-6 cursor-pointer ${expandedCustomer === customer.id ? 'bg-blue-50' : ''}`}
                onClick={() => toggleCustomerExpansion(customer.id)}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                    <div className="ml-4">
                      <div className="flex items-center">
                        <h3 className="font-bold text-lg text-gray-800">{customer.name}</h3>
                        <span className={`ml-3 px-2 py-1 rounded-full text-xs font-medium ${
                          customer.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {customer.status === 'active' ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <p className="text-gray-600 mt-1">{customer.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="mr-6 text-right">
                      <p className="text-gray-500 text-sm">Total Orders</p>
                      <p className="font-bold text-gray-800">{customer.totalOrders}</p>
                    </div>
                    <div className="mr-6 text-right">
                      <p className="text-gray-500 text-sm">Total Spent</p>
                      <p className="font-bold text-gray-800">{formatCurrency(customer.totalSpent)}</p>
                    </div>
                    <div>
                      {expandedCustomer === customer.id ? (
                        <ChevronUp className="text-gray-500" />
                      ) : (
                        <ChevronDown className="text-gray-500" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Expanded Details */}
              {expandedCustomer === customer.id && (
                <div className="border-t border-gray-200 p-6 bg-white">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-700 mb-3">Contact Information</h4>
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <Mail className="text-gray-500 mr-3" size={18} />
                          <span>{customer.email}</span>
                        </div>
                        <div className="flex items-center">
                          <Phone className="text-gray-500 mr-3" size={18} />
                          <span>{customer.phone}</span>
                        </div>
                        <div className="flex items-center">
                          <User className="text-gray-500 mr-3" size={18} />
                          <span>{customer.location}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-700 mb-3">Order History</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Joined</span>
                          <span className="font-medium">{formatDate(customer.joinDate)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Last Order</span>
                          <span className="font-medium">{formatDate(customer.lastOrder)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Orders</span>
                          <span className="font-medium">{customer.totalOrders}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Spent</span>
                          <span className="font-medium">{formatCurrency(customer.totalSpent)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-700 mb-3">Actions</h4>
                      <div className="flex flex-wrap gap-3">
                        <button className="flex items-center bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium py-2 px-4 rounded-lg transition-colors">
                          <Edit className="mr-2" size={16} />
                          Edit
                        </button>
                        <button className="flex items-center bg-red-100 hover:bg-red-200 text-red-700 font-medium py-2 px-4 rounded-lg transition-colors">
                          <Trash2 className="mr-2" size={16} />
                          Delete
                        </button>
                        <button className="flex items-center bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors">
                          <Mail className="mr-2" size={16} />
                          Message
                        </button>
                        <button className="flex items-center bg-green-100 hover:bg-green-200 text-green-700 font-medium py-2 px-4 rounded-lg transition-colors">
                          <ShoppingBag className="mr-2" size={16} />
                          View Orders
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* Empty State */}
        {filteredCustomers.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="mx-auto bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mb-6" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">No customers found</h3>
            <p className="text-gray-600 max-w-md mx-auto mb-6">
              There are no customers matching your search criteria. Try adjusting your filters or search term.
            </p>
            <button 
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
              }}
            >
              Reset Filters
            </button>
          </div>
        )}
        
        {/* Pagination */}
        {filteredCustomers.length > 0 && (
          <div className="flex justify-between items-center mt-8">
            <div className="text-gray-600">
              Showing 1 to {filteredCustomers.length} of {filteredCustomers.length} results
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50">
                Previous
              </button>
              <button className="px-4 py-2 rounded-lg bg-blue-600 text-white">
                1
              </button>
              <button className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50">
                2
              </button>
              <button className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50">
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Customer;