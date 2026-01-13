import React, { useState, useEffect } from 'react';
import { ArrowLeft, CreditCard, Truck, Shield } from 'lucide-react';
import PageWrapper from '../components/PageWrapper';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext'; // Import the cart context
import { useOrders } from '../context/OrderContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || "";

const CheckOutPage = () => {
  const [activeStep, setActiveStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('stripe');
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [sameAsShipping, setSameAsShipping] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Get cart items from context
  const { cartItems, clearCart } = useCart();
  const { createOrder } = useOrders();
  const { isAuthenticated } = useAuth();

  // Shipping form state
  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States'
  });

  // Calculate totals using real cart items
  const subtotal = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const shippingFee = shippingMethod === 'express' ? 15 : 0;
  const tax = subtotal * 0.08;
  const total = subtotal + shippingFee + tax;

  // Scroll to top when step changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeStep]);

  // Handle input changes
  const handleShippingChange = (e) => {
    setShippingInfo({
      ...shippingInfo,
      [e.target.name]: e.target.value
    });
  };

  // Validate shipping info
  const validateShippingInfo = () => {
    const { firstName, lastName, email, address, city, state, zipCode, country } = shippingInfo;
    if (!firstName || !lastName || !email || !address || !city || !state || !zipCode || !country) {
      setError('Please fill in all shipping information fields');
      return false;
    }
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }
    return true;
  };

  // Handle place order with Stripe
  const handlePlaceOrder = async () => {
    if (!isAuthenticated) {
      setError('Please login to place an order');
      return;
    }

    if (cartItems.length === 0) {
      setError('Your cart is empty');
      return;
    }

    if (!validateShippingInfo()) {
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      // Prepare order data
      const orderData = {
        orderItems: cartItems.map(item => ({
          name: item.product.name,
          qty: item.quantity,
          image: item.product.images?.[0] || item.product.image,
          price: item.product.price,
          product: item.product._id
        })),
        shippingAddress: {
          address: shippingInfo.address,
          city: shippingInfo.city,
          postalCode: shippingInfo.zipCode,
          country: shippingInfo.country,
          state: shippingInfo.state
        },
        paymentMethod: 'Stripe',
        taxPrice: tax,
        shippingPrice: shippingFee,
        totalPrice: total
      };

      // Create order in database
      const order = await createOrder(orderData);
      
      if (!order || !order._id) {
        throw new Error('Failed to create order');
      }

      // Create Stripe checkout session
      const token = localStorage.getItem('authToken');
      const response = await axios.post(
        `${API}/stripe/create-checkout-session`,
        { orderId: order._id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.url) {
        // Redirect to Stripe checkout
        window.location.href = response.data.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (err) {
      console.error('Order placement error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to process order. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <PageWrapper>
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50/30 to-purple-50/30 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            to="/cart" 
            className="inline-flex items-center text-indigo-600 hover:text-indigo-700 font-medium transition-colors group mb-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" /> 
            Back to Cart
          </Link>
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Secure Checkout
            </h1>
            <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600">
              <Shield className="h-5 w-5 text-green-600" />
              <span className="font-medium">Secure SSL Encrypted</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Steps */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8">
            {/* Progress Steps */}
            <div className="flex justify-between mb-12 relative px-4">
              {/* Line */}
              <div className="absolute top-5 left-20 right-20 h-1 bg-gray-200 rounded-full z-0"></div>
              <div 
                className="absolute top-5 left-20 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full z-0 transition-all duration-500"
                style={{ width: `${((activeStep - 1) / 2) * (100 - 40)}%` }}
              ></div>
              
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex flex-col items-center z-10 relative">
                  <div 
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 shadow-lg
                      ${activeStep >= step 
                        ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white scale-110' 
                        : 'bg-white text-gray-400 border-2 border-gray-300'
                      }`}
                  >
                    {activeStep > step ? (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : step}
                  </div>
                  <span className={`mt-3 text-sm font-semibold transition-colors ${activeStep >= step ? 'text-indigo-600' : 'text-gray-500'}`}>
                    {step === 1 ? 'Shipping' : step === 2 ? 'Payment' : 'Review'}
                  </span>
                </div>
              ))}
            </div>

            {/* Step 1: Shipping Information */}
            {activeStep === 1 && (
              <div className="animate-fadeIn">
                <div className="flex items-center mb-6">
                  <div className="bg-indigo-100 p-2 rounded-lg mr-3">
                    <Truck className="h-6 w-6 text-indigo-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Shipping Information</h2>
                </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                  <input 
                    type="text"
                    name="firstName"
                    value={shippingInfo.firstName}
                    onChange={handleShippingChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="John"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                  <input 
                    type="text"
                    name="lastName"
                    value={shippingInfo.lastName}
                    onChange={handleShippingChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Doe"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input 
                    type="email"
                    name="email"
                    value={shippingInfo.email}
                    onChange={handleShippingChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="john.doe@example.com"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
                  <input 
                    type="text"
                    name="address"
                    value={shippingInfo.address}
                    onChange={handleShippingChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="123 Main Street"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                  <input 
                    type="text"
                    name="city"
                    value={shippingInfo.city}
                    onChange={handleShippingChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="New York"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                  <input 
                    type="text"
                    name="state"
                    value={shippingInfo.state}
                    onChange={handleShippingChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="NY"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code</label>
                  <input 
                    type="text"
                    name="zipCode"
                    value={shippingInfo.zipCode}
                    onChange={handleShippingChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="10001"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                  <select 
                    name="country"
                    value={shippingInfo.country}
                    onChange={handleShippingChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  >
                    <option>United States</option>
                    <option>Canada</option>
                    <option>United Kingdom</option>
                  </select>
                </div>
              </div>
              
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping Method</h3>
                  <div className="space-y-3">
                    <div 
                      className={`relative flex items-center p-5 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                        shippingMethod === 'standard' 
                          ? 'border-indigo-600 bg-gradient-to-r from-indigo-50 to-purple-50 shadow-md' 
                          : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                      }`}
                      onClick={() => setShippingMethod('standard')}
                    >
                      <div className={`h-6 w-6 rounded-full border-2 mr-4 flex items-center justify-center transition-all ${
                        shippingMethod === 'standard' ? 'border-indigo-600 bg-indigo-600' : 'border-gray-300'
                      }`}>
                        {shippingMethod === 'standard' && <div className="h-3 w-3 rounded-full bg-white"></div>}
                      </div>
                      <Truck className="h-6 w-6 text-gray-400 mr-3" />
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-gray-900">Standard Shipping</span>
                          <span className="text-lg font-bold text-green-600">Free</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">Delivery in 3-5 business days</p>
                      </div>
                      {shippingMethod === 'standard' && (
                        <div className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                          Selected
                        </div>
                      )}
                    </div>
                    
                    <div 
                      className={`relative flex items-center p-5 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                        shippingMethod === 'express' 
                          ? 'border-indigo-600 bg-gradient-to-r from-indigo-50 to-purple-50 shadow-md' 
                          : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                      }`}
                      onClick={() => setShippingMethod('express')}
                    >
                      <div className={`h-6 w-6 rounded-full border-2 mr-4 flex items-center justify-center transition-all ${
                        shippingMethod === 'express' ? 'border-indigo-600 bg-indigo-600' : 'border-gray-300'
                      }`}>
                        {shippingMethod === 'express' && <div className="h-3 w-3 rounded-full bg-white"></div>}
                      </div>
                      <svg className="h-6 w-6 text-gray-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="font-semibold text-gray-900">Express Shipping</span>
                            <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full font-semibold">FAST</span>
                          </div>
                          <span className="text-lg font-bold text-indigo-600">$15.00</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">Delivery in 1-2 business days</p>
                      </div>
                      {shippingMethod === 'express' && (
                        <div className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                          Selected
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              
                <div className="mt-8 flex justify-end">
                  <button 
                    onClick={() => setActiveStep(2)}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 px-10 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center group"
                  >
                    Continue to Payment
                    <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Payment Method */}
            {activeStep === 2 && (
              <div className="animate-fadeIn">
                <div className="flex items-center mb-6">
                  <div className="bg-indigo-100 p-2 rounded-lg mr-3">
                    <CreditCard className="h-6 w-6 text-indigo-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Payment Method</h2>
                </div>
              
                <div className="space-y-4">
                  <div 
                    className={`relative p-6 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                      paymentMethod === 'stripe' 
                        ? 'border-indigo-600 bg-gradient-to-r from-indigo-50 to-purple-50 shadow-lg' 
                        : 'border-gray-200'
                    }`}
                    onClick={() => setPaymentMethod('stripe')}
                  >
                    <div className="flex items-start">
                      <div className={`h-6 w-6 rounded-full border-2 mt-1 mr-4 flex items-center justify-center flex-shrink-0 transition-all ${
                        paymentMethod === 'stripe' ? 'border-indigo-600 bg-indigo-600' : 'border-gray-300'
                      }`}>
                        {paymentMethod === 'stripe' && <div className="h-3 w-3 rounded-full bg-white"></div>}
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-wrap justify-between items-center gap-4 mb-3">
                          <div className="flex items-center">
                            <span className="font-bold text-lg text-gray-900">Stripe Payment</span>
                            <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-semibold">RECOMMENDED</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-7 opacity-70" />
                            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-7 opacity-70" />
                            <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/American_Express_logo_%282018%29.svg" alt="Amex" className="h-7 opacity-70" />
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          Secure payment processing powered by Stripe. You'll be redirected to a secure checkout page to complete your payment safely.
                        </p>
                        <div className="mt-4 flex items-center text-xs text-gray-500">
                          <Shield className="h-4 w-4 text-green-600 mr-2" />
                          <span>256-bit SSL encryption • PCI DSS compliant</span>
                        </div>
                      </div>
                    </div>
                    {paymentMethod === 'stripe' && (
                      <div className="absolute -top-2 -right-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                        Selected
                      </div>
                    )}
                  </div>
                  
                  <div className="p-5 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl">
                    <div className="flex items-start">
                      <div className="bg-blue-100 p-2 rounded-lg mr-3 flex-shrink-0">
                        <Shield className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-blue-900 font-semibold mb-1">Your Security is Our Priority</p>
                        <p className="text-sm text-blue-800 leading-relaxed">
                          Your payment information is encrypted and never stored on our servers. All transactions are processed securely through Stripe's PCI-compliant infrastructure.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              
                <div className="mt-8 flex justify-between">
                  <button 
                    onClick={() => setActiveStep(1)}
                    className="text-gray-700 font-semibold py-3 px-8 rounded-xl border-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 flex items-center group"
                  >
                    <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back
                  </button>
                  <button 
                    onClick={() => setActiveStep(3)}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 px-10 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center group"
                  >
                    Continue to Review
                    <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Order Review */}
            {activeStep === 3 && (
              <div className="animate-fadeIn">
                <div className="flex items-center mb-6">
                  <div className="bg-indigo-100 p-2 rounded-lg mr-3">
                    <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Review Your Order</h2>
                </div>
              
                <div className="border-2 border-gray-200 rounded-xl overflow-hidden shadow-sm">
                {cartItems.map((item) => (
                  <div key={item.id} className="p-4 border-b border-gray-200 flex">
                    <div className="bg-gray-100 rounded-lg w-16 h-16 overflow-hidden mr-4">
                      <img 
                        src={item.product.images?.[0] || "https://via.placeholder.com/100"} 
                        alt={item.product.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.product.name}</h3>
                      <div className="flex justify-between mt-2">
                        <p className="text-gray-600">${item.product.price.toFixed(2)} × {item.quantity}</p>
                        <p className="font-medium">${(item.product.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                ))}
                
                <div className="p-4">
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">{shippingFee > 0 ? `$${shippingFee.toFixed(2)}` : 'Free'}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-medium">${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-t border-gray-200 mt-2 pt-4">
                    <span className="text-lg font-bold text-gray-900">Total</span>
                    <span className="text-xl font-bold text-indigo-600">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Shipping Address</h3>
                <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4">
                  <p className="font-medium">{shippingInfo.firstName} {shippingInfo.lastName}</p>
                  <p className="text-gray-700">{shippingInfo.address}</p>
                  <p className="text-gray-700">{shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}</p>
                  <p className="text-gray-700">{shippingInfo.country}</p>
                  <p className="text-gray-700 mt-2">{shippingInfo.email}</p>
                </div>
              </div>
              
              <div className="mt-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Method</h3>
                <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4">
                  <p className="font-medium">Stripe - Secure Payment</p>
                  <p className="text-gray-700 text-sm mt-1">You'll be redirected to Stripe to complete your payment securely</p>
                </div>
              </div>
              
                {error && (
                  <div className="mt-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl flex items-start animate-pulse">
                    <svg className="h-5 w-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <p className="text-sm text-red-800 font-medium">{error}</p>
                  </div>
                )}
              
              <div className="mt-8 flex items-center">
                <input
                  type="checkbox"
                  id="terms"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  required
                />
                <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                  I agree to the{' '}
                  <a href="#" className="text-indigo-600 hover:text-indigo-800">
                    terms and conditions
                  </a>
                </label>
              </div>
              
                <div className="mt-8 flex justify-between gap-4">
                  <button 
                    onClick={() => setActiveStep(2)}
                    className="text-gray-700 font-semibold py-3 px-8 rounded-xl border-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 flex items-center group disabled:opacity-50"
                    disabled={isProcessing}
                  >
                    <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={isProcessing}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 px-10 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-200 flex items-center disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-3"></div>
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <Shield className="h-5 w-5 mr-2" />
                        <span>Place Order & Pay</span>
                        <svg className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        
        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Order Summary</h2>
              <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full">
                {cartItems.length} {cartItems.length === 1 ? 'Item' : 'Items'}
              </span>
            </div>
            
            <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="bg-white rounded-lg w-16 h-16 overflow-hidden mr-4 shadow-sm flex-shrink-0">
                    <img 
                      src={item.product.images?.[0] || "https://via.placeholder.com/100"} 
                      alt={item.product.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 line-clamp-1 text-sm">{item.product.name}</h3>
                    <div className="flex justify-between mt-1.5">
                      <p className="text-sm text-gray-600">${item.product.price.toFixed(2)} × {item.quantity}</p>
                      <p className="font-bold text-indigo-600 text-sm">${(item.product.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 pt-6 border-t-2 border-gray-100 space-y-3">
              <div className="flex justify-between py-2 text-gray-700">
                <span className="font-medium">Subtotal</span>
                <span className="font-semibold">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2 text-gray-700">
                <span className="font-medium">Shipping</span>
                <span className={`font-semibold ${shippingFee === 0 ? 'text-green-600' : ''}`}>
                  {shippingFee > 0 ? `$${shippingFee.toFixed(2)}` : 'Free'}
                </span>
              </div>
              <div className="flex justify-between py-2 text-gray-700">
                <span className="font-medium">Tax (8%)</span>
                <span className="font-semibold">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-4 border-t-2 border-gray-200 mt-4">
                <span className="text-xl font-bold text-gray-900">Total</span>
                <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-100 rounded-xl">
              <div className="flex items-start">
                <Shield className="h-6 w-6 text-indigo-600 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-1">100% Secure Checkout</p>
                  <p className="text-xs text-gray-700 leading-relaxed">
                    Your payment information is encrypted and secure. We never store your credit card details.
                  </p>
                </div>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="flex flex-col items-center">
                  <div className="bg-green-100 p-2 rounded-lg mb-2">
                    <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="text-xs font-medium text-gray-700">Secure</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="bg-blue-100 p-2 rounded-lg mb-2">
                    <Truck className="h-5 w-5 text-blue-600" />
                  </div>
                  <span className="text-xs font-medium text-gray-700">Fast Ship</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="bg-purple-100 p-2 rounded-lg mb-2">
                    <svg className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </div>
                  <span className="text-xs font-medium text-gray-700">Easy Return</span>
                </div>
              </div>
              </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default CheckOutPage;