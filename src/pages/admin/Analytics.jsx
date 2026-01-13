import { FiTrendingUp, FiBarChart2, FiPieChart, FiDollarSign, FiUsers, FiShoppingBag, FiActivity } from 'react-icons/fi';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';

const Analytics = () => {
    // Mock data for charts
    const salesData = [
        { month: 'Jan', sales: 4000, revenue: 2400, orders: 240 },
        { month: 'Feb', sales: 3000, revenue: 1398, orders: 221 },
        { month: 'Mar', sales: 2000, revenue: 9800, orders: 229 },
        { month: 'Apr', sales: 2780, revenue: 3908, orders: 200 },
        { month: 'May', sales: 1890, revenue: 4800, orders: 218 },
        { month: 'Jun', sales: 2390, revenue: 3800, orders: 250 },
        { month: 'Jul', sales: 3490, revenue: 4300, orders: 210 },
    ];

    const categoryData = [
        { name: 'Men', value: 400, color: '#3b82f6' },
        { name: 'Women', value: 300, color: '#8b5cf6' },
        { name: 'Kids', value: 200, color: '#ec4899' },
        { name: 'Accessories', value: 100, color: '#f59e0b' },
    ];

    const trafficData = [
        { source: 'Direct', visitors: 4200, color: '#3b82f6' },
        { source: 'Social Media', visitors: 3100, color: '#8b5cf6' },
        { source: 'Search Engine', visitors: 2800, color: '#10b981' },
        { source: 'Referral', visitors: 1500, color: '#f59e0b' },
    ];

    const topProducts = [
        { name: 'Nike Air Max', sales: 234, revenue: '$18,720', trend: '+12%' },
        { name: 'Adidas Hoodie', sales: 189, revenue: '$13,230', trend: '+8%' },
        { name: 'Summer Dress', sales: 156, revenue: '$10,920', trend: '+15%' },
        { name: 'Running Shorts', sales: 143, revenue: '$8,580', trend: '+5%' },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Analytics Dashboard</h2>
                    <p className="text-gray-500 mt-1">Track your store performance and insights</p>
                </div>
                <div className="flex gap-3">
                    <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>Last 7 days</option>
                        <option>Last 30 days</option>
                        <option>Last 90 days</option>
                        <option>Last year</option>
                    </select>
                </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard
                    icon={<FiDollarSign className="text-green-500" size={24} />}
                    title="Total Revenue"
                    value="$45,231"
                    change="+20.1%"
                    positive={true}
                    bgColor="bg-green-50"
                />
                <MetricCard
                    icon={<FiShoppingBag className="text-blue-500" size={24} />}
                    title="Total Orders"
                    value="1,234"
                    change="+15.3%"
                    positive={true}
                    bgColor="bg-blue-50"
                />
                <MetricCard
                    icon={<FiUsers className="text-purple-500" size={24} />}
                    title="New Customers"
                    value="573"
                    change="+8.2%"
                    positive={true}
                    bgColor="bg-purple-50"
                />
                <MetricCard
                    icon={<FiActivity className="text-orange-500" size={24} />}
                    title="Conversion Rate"
                    value="3.24%"
                    change="-2.4%"
                    positive={false}
                    bgColor="bg-orange-50"
                />
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Chart */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-semibold text-gray-800">Revenue Overview</h3>
                        <FiTrendingUp className="text-green-500" size={20} />
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={salesData}>
                            <defs>
                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Area type="monotone" dataKey="revenue" stroke="#3b82f6" fillOpacity={1} fill="url(#colorRevenue)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Orders Chart */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-semibold text-gray-800">Orders Trend</h3>
                        <FiBarChart2 className="text-blue-500" size={20} />
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={salesData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="orders" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Charts Row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Category Distribution */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-semibold text-gray-800">Sales by Category</h3>
                        <FiPieChart className="text-purple-500" size={20} />
                    </div>
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie
                                data={categoryData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {categoryData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Traffic Sources */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-6">Traffic Sources</h3>
                    <div className="space-y-4">
                        {trafficData.map((source, index) => (
                            <div key={index}>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm text-gray-600">{source.source}</span>
                                    <span className="text-sm font-medium text-gray-800">{source.visitors.toLocaleString()}</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="h-2 rounded-full transition-all"
                                        style={{
                                            width: `${(source.visitors / 4200) * 100}%`,
                                            backgroundColor: source.color
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Products */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-6">Top Products</h3>
                    <div className="space-y-4">
                        {topProducts.map((product, index) => (
                            <div key={index} className="flex items-center justify-between">
                                <div className="flex-1">
                                    <p className="font-medium text-gray-800 text-sm">{product.name}</p>
                                    <p className="text-xs text-gray-500">{product.sales} sales</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-medium text-gray-800 text-sm">{product.revenue}</p>
                                    <p className={`text-xs ${product.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                                        {product.trend}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Metric Card Component
const MetricCard = ({ icon, title, value, change, positive, bgColor }) => (
    <div className={`${bgColor} rounded-xl shadow-sm border border-gray-100 p-6`}>
        <div className="flex justify-between items-start">
            <div>
                <p className="text-gray-500 text-sm font-medium">{title}</p>
                <p className="text-3xl font-bold mt-2 text-gray-800">{value}</p>
            </div>
            <div className={`p-3 rounded-lg ${bgColor.replace('50', '100')}`}>
                {icon}
            </div>
        </div>
        <p className={`mt-3 flex items-center gap-1 text-sm ${positive ? 'text-green-600' : 'text-red-600'}`}>
            <span>{change}</span>
            <span className="text-gray-500">vs last period</span>
        </p>
    </div>
);

export default Analytics;
