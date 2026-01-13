import { useState } from 'react';
import { FiSave, FiMail, FiBell, FiLock, FiGlobe, FiCreditCard, FiShield, FiUser } from 'react-icons/fi';

const Settings = () => {
    const [settings, setSettings] = useState({
        // General Settings
        storeName: 'E-Shop',
        storeEmail: 'contact@eshop.com',
        storePhone: '+1 (555) 123-4567',
        currency: 'USD',
        timezone: 'UTC-5',

        // Notification Settings
        emailNotifications: true,
        orderNotifications: true,
        stockAlerts: true,
        promotionalEmails: false,

        // Security Settings
        twoFactorAuth: false,
        sessionTimeout: '30',

        // Payment Settings
        stripeEnabled: true,
        paypalEnabled: false,
        codEnabled: true,
    });

    const [activeTab, setActiveTab] = useState('general');

    const handleChange = (field, value) => {
        setSettings(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        alert('Settings saved successfully!');
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Settings</h2>
                    <p className="text-gray-500 mt-1">Manage your store configuration</p>
                </div>
                <button
                    onClick={handleSave}
                    className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-2 rounded-lg hover:from-blue-600 hover:to-indigo-700 transition shadow-md"
                >
                    <FiSave size={18} />
                    Save Changes
                </button>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="border-b border-gray-200">
                    <nav className="flex gap-8 px-6">
                        {[
                            { id: 'general', label: 'General', icon: FiGlobe },
                            { id: 'notifications', label: 'Notifications', icon: FiBell },
                            { id: 'security', label: 'Security', icon: FiShield },
                            { id: 'payment', label: 'Payment', icon: FiCreditCard },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 py-4 border-b-2 transition-colors ${activeTab === tab.id
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                <tab.icon size={18} />
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="p-6">
                    {/* General Settings */}
                    {activeTab === 'general' && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">General Settings</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Store Name
                                    </label>
                                    <input
                                        type="text"
                                        value={settings.storeName}
                                        onChange={(e) => handleChange('storeName', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Store Email
                                    </label>
                                    <input
                                        type="email"
                                        value={settings.storeEmail}
                                        onChange={(e) => handleChange('storeEmail', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        value={settings.storePhone}
                                        onChange={(e) => handleChange('storePhone', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Currency
                                    </label>
                                    <select
                                        value={settings.currency}
                                        onChange={(e) => handleChange('currency', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="USD">USD - US Dollar</option>
                                        <option value="EUR">EUR - Euro</option>
                                        <option value="GBP">GBP - British Pound</option>
                                        <option value="PKR">PKR - Pakistani Rupee</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Timezone
                                    </label>
                                    <select
                                        value={settings.timezone}
                                        onChange={(e) => handleChange('timezone', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="UTC-5">UTC-5 (Eastern Time)</option>
                                        <option value="UTC-6">UTC-6 (Central Time)</option>
                                        <option value="UTC-7">UTC-7 (Mountain Time)</option>
                                        <option value="UTC-8">UTC-8 (Pacific Time)</option>
                                        <option value="UTC+5">UTC+5 (Pakistan Time)</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Notification Settings */}
                    {activeTab === 'notifications' && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Notification Preferences</h3>

                            <div className="space-y-4">
                                <ToggleSetting
                                    icon={<FiMail />}
                                    label="Email Notifications"
                                    description="Receive email notifications for important updates"
                                    checked={settings.emailNotifications}
                                    onChange={(checked) => handleChange('emailNotifications', checked)}
                                />
                                <ToggleSetting
                                    icon={<FiBell />}
                                    label="Order Notifications"
                                    description="Get notified when new orders are placed"
                                    checked={settings.orderNotifications}
                                    onChange={(checked) => handleChange('orderNotifications', checked)}
                                />
                                <ToggleSetting
                                    icon={<FiBell />}
                                    label="Stock Alerts"
                                    description="Receive alerts when products are low in stock"
                                    checked={settings.stockAlerts}
                                    onChange={(checked) => handleChange('stockAlerts', checked)}
                                />
                                <ToggleSetting
                                    icon={<FiMail />}
                                    label="Promotional Emails"
                                    description="Receive promotional and marketing emails"
                                    checked={settings.promotionalEmails}
                                    onChange={(checked) => handleChange('promotionalEmails', checked)}
                                />
                            </div>
                        </div>
                    )}

                    {/* Security Settings */}
                    {activeTab === 'security' && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Security Settings</h3>

                            <div className="space-y-6">
                                <ToggleSetting
                                    icon={<FiLock />}
                                    label="Two-Factor Authentication"
                                    description="Add an extra layer of security to your account"
                                    checked={settings.twoFactorAuth}
                                    onChange={(checked) => handleChange('twoFactorAuth', checked)}
                                />

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Session Timeout (minutes)
                                    </label>
                                    <input
                                        type="number"
                                        value={settings.sessionTimeout}
                                        onChange={(e) => handleChange('sessionTimeout', e.target.value)}
                                        className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <p className="text-sm text-gray-500 mt-1">Automatically log out after this period of inactivity</p>
                                </div>

                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                    <div className="flex items-start gap-3">
                                        <FiShield className="text-yellow-600 mt-0.5" size={20} />
                                        <div>
                                            <h4 className="font-medium text-yellow-800">Security Recommendation</h4>
                                            <p className="text-sm text-yellow-700 mt-1">
                                                We recommend enabling two-factor authentication and using a strong, unique password.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Payment Settings */}
                    {activeTab === 'payment' && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Payment Methods</h3>

                            <div className="space-y-4">
                                <ToggleSetting
                                    icon={<FiCreditCard />}
                                    label="Stripe"
                                    description="Accept credit and debit card payments via Stripe"
                                    checked={settings.stripeEnabled}
                                    onChange={(checked) => handleChange('stripeEnabled', checked)}
                                />
                                <ToggleSetting
                                    icon={<FiCreditCard />}
                                    label="PayPal"
                                    description="Accept payments through PayPal"
                                    checked={settings.paypalEnabled}
                                    onChange={(checked) => handleChange('paypalEnabled', checked)}
                                />
                                <ToggleSetting
                                    icon={<FiCreditCard />}
                                    label="Cash on Delivery"
                                    description="Allow customers to pay when they receive their order"
                                    checked={settings.codEnabled}
                                    onChange={(checked) => handleChange('codEnabled', checked)}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// Toggle Setting Component
const ToggleSetting = ({ icon, label, description, checked, onChange }) => (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div className="flex items-start gap-3">
            <div className="text-gray-600 mt-1">{icon}</div>
            <div>
                <h4 className="font-medium text-gray-800">{label}</h4>
                <p className="text-sm text-gray-500 mt-0.5">{description}</p>
            </div>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
            <input
                type="checkbox"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
                className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
    </div>
);

export default Settings;
