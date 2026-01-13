import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import PageWrapper from '../components/PageWrapper';
import { CheckCircle, Package, ArrowRight, Home } from 'lucide-react';
import { useCart } from '../context/CartContext';

function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const [sessionId, setSessionId] = useState('');

  useEffect(() => {
    const session_id = searchParams.get('session_id');
    
    if (session_id) {
      setSessionId(session_id);
      // Clear the cart after successful payment
      clearCart();
    } else {
      // If no session_id, redirect to home after 3 seconds
      const timer = setTimeout(() => {
        navigate('/');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [searchParams, navigate, clearCart]);

  return (
    <PageWrapper>
      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center">
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="bg-green-100 rounded-full p-4">
              <CheckCircle className="h-16 w-16 text-green-600" />
            </div>
          </div>

          {/* Success Message */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Payment Successful!
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Thank you for your purchase. Your order has been confirmed and will be processed shortly.
          </p>

          {/* Order Details */}
          {sessionId && (
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-600">Transaction ID:</span>
                <span className="text-sm font-mono font-medium text-gray-900">
                  {sessionId.substring(0, 24)}...
                </span>
              </div>
              <div className="flex items-center justify-center text-sm text-gray-600">
                <Package className="h-5 w-5 mr-2" />
                <span>You'll receive an email confirmation shortly</span>
              </div>
            </div>
          )}

          {/* What's Next */}
          <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-6 mb-8 text-left">
            <h3 className="font-semibold text-gray-900 mb-3">What happens next?</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start">
                <span className="text-indigo-600 mr-2">✓</span>
                <span>You'll receive an order confirmation email</span>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-600 mr-2">✓</span>
                <span>We'll prepare your items for shipping</span>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-600 mr-2">✓</span>
                <span>You'll get a tracking number once shipped</span>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-600 mr-2">✓</span>
                <span>Track your order status in your account</span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/account"
              className="inline-flex items-center justify-center px-6 py-3 border border-indigo-600 text-indigo-600 rounded-lg font-medium hover:bg-indigo-50 transition-colors"
            >
              <Package className="h-5 w-5 mr-2" />
              View Orders
            </Link>
            <Link
              to="/"
              className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              <Home className="h-5 w-5 mr-2" />
              Continue Shopping
              <ArrowRight className="h-5 w-5 ml-2" />
            </Link>
          </div>

          {/* Support */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Need help?{' '}
              <a href="#" className="text-indigo-600 hover:text-indigo-800 font-medium">
                Contact our support team
              </a>
            </p>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}

export default PaymentSuccess;
