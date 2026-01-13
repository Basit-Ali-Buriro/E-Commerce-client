// src/pages/admin/Dashboard.jsx
import { FiBox, FiShoppingCart, FiDollarSign, FiUser, FiActivity, FiArrowUp, FiStar } from "react-icons/fi";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  // Sample data for charts
  const revenueData = [
    { name: 'Jan', revenue: 4000 },
    { name: 'Feb', revenue: 3000 },
    { name: 'Mar', revenue: 2000 },
    { name: 'Apr', revenue: 2780 },
    { name: 'May', revenue: 1890 },
    { name: 'Jun', revenue: 2390 },
    { name: 'Jul', revenue: 3490 },
    { name: 'Aug', revenue: 4300 },
  ];

  const recentActivities = [
    { id: 1, user: "John Doe", action: "placed a new order", time: "2 min ago" },
    { id: 2, user: "Jane Smith", action: "created an account", time: "15 min ago" },
    { id: 3, user: "Admin", action: "added new product", time: "1 hour ago" },
    { id: 4, user: "David Lee", action: "completed payment", time: "3 hours ago" },
  ];

  const topProducts = [
    { id: 1, name: "Nike Air Max 2023", sales: 120, revenue: "$18,000" },
    { id: 2, name: "Adidas Hoodie", sales: 89, revenue: "$6,230" },
    { id: 3, name: "Running Shorts", sales: 76, revenue: "$2,660" },
    { id: 4, name: "Summer Dress", sales: 65, revenue: "$5,785" },
  ];

  return (
    <section className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <h2 className="text-2xl font-bold text-gray-800">Dashboard Overview</h2>
        <div className="flex gap-3 mt-4 md:mt-0">
          <div className="relative">
            <select className="appearance-none pl-3 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <FiChevronDown className="text-gray-400" />
            </div>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            Generate Report
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<FiBox className="text-blue-500" size={24} />}
          title="Total Products"
          value="120"
          change="+12% from last month"
          changePositive={true}
          bgColor="bg-blue-50"
        />
        <StatCard
          icon={<FiShoppingCart className="text-green-500" size={24} />}
          title="Orders"
          value="89"
          change="+8% from last week"
          changePositive={true}
          bgColor="bg-green-50"
        />
        <StatCard
          icon={<FiDollarSign className="text-purple-500" size={24} />}
          title="Revenue"
          value="$12,300"
          change="+15.7% from last month"
          changePositive={true}
          bgColor="bg-purple-50"
        />
        <StatCard
          icon={<FiUser className="text-yellow-500" size={24} />}
          title="New Customers"
          value="24"
          change="+3.2% from last week"
          changePositive={true}
          bgColor="bg-yellow-50"
        />
      </div>

      {/* Charts and Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Revenue Overview</h3>
            <button className="text-sm text-blue-600 hover:text-blue-800">View Report</button>
          </div>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Bar
                  dataKey="revenue"
                  fill="#4f46e5"
                  radius={[4, 4, 0, 0]}
                  barSize={24}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Recent Activity</h3>
            <button className="text-sm text-blue-600 hover:text-blue-800">View All</button>
          </div>

          <div className="space-y-4">
            {recentActivities.map(activity => (
              <div key={activity.id} className="flex items-start gap-3">
                <div className="mt-1 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <FiActivity className="text-blue-500" size={16} />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{activity.user}</p>
                  <p className="text-gray-600 text-sm">{activity.action}</p>
                </div>
                <span className="text-xs text-gray-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Top Selling Products</h3>
            <button className="text-sm text-blue-600 hover:text-blue-800">View All</button>
          </div>

          <div className="space-y-4">
            {topProducts.map((product) => (
              <div key={product.id} className="flex items-center gap-4">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{product.name}</p>
                  <p className="text-gray-600 text-sm">{product.sales} sold</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-800">{product.revenue}</p>
                  <div className="flex items-center gap-1 text-sm text-green-600">
                    <FiStar className="fill-yellow-400 text-yellow-400" />
                    <span>4.8</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Store Performance</h3>
            <button className="text-sm text-blue-600 hover:text-blue-800">View Details</button>
          </div>

          <div className="space-y-5">
            <PerformanceMetric
              title="Conversion Rate"
              value="3.2%"
              change="+0.4%"
              changePositive={true}
              progress={65}
            />
            <PerformanceMetric
              title="Average Order Value"
              value="$138.20"
              change="+$8.20"
              changePositive={true}
              progress={75}
            />
            <PerformanceMetric
              title="Customer Satisfaction"
              value="4.7/5"
              change="+0.2"
              changePositive={true}
              progress={85}
            />
            <PerformanceMetric
              title="Return Rate"
              value="5.1%"
              change="-1.2%"
              changePositive={false}
              progress={20}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

// Stat Card Component
const StatCard = ({ icon, title, value, change, changePositive, bgColor }) => (
  <div className={`${bgColor} rounded-xl shadow-sm border border-gray-100 p-6 transition-all hover:shadow-md`}>
    <div className="flex justify-between items-start">
      <div>
        <h3 className="text-gray-500 font-medium">{title}</h3>
        <p className="text-3xl font-bold mt-2 text-gray-800">{value}</p>
      </div>
      <div className={`p-3 rounded-lg ${bgColor.replace('50', '100')}`}>
        {icon}
      </div>
    </div>
    <p className={`mt-3 flex items-center gap-1 text-sm ${changePositive ? 'text-green-600' : 'text-red-600'}`}>
      <FiArrowUp className={changePositive ? '' : 'transform rotate-180'} />
      <span>{change}</span>
    </p>
  </div>
);

// Performance Metric Component
const PerformanceMetric = ({ title, value, change, changePositive, progress }) => (
  <div>
    <div className="flex justify-between items-center mb-1">
      <span className="text-gray-600">{title}</span>
      <div className="flex items-center gap-2">
        <span className="font-medium text-gray-800">{value}</span>
        <span className={`text-xs px-2 py-1 rounded-full ${changePositive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {change}
        </span>
      </div>
    </div>
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div
        className={`h-2 rounded-full ${changePositive ? 'bg-green-500' : 'bg-red-500'}`}
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  </div>
);

// Helper component for chevron down
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

export default Dashboard;