import React from "react";
import { useCart } from "../context/CartContext";
import { X, Plus, Minus, ShoppingCart, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const Cart = () => {
  const {
    cartItems,
    total,
    updateCartItem,
    removeCartItem,
    clearCart,
    loading,
  } = useCart();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mb-4"></div>
        <p className="text-lg text-gray-600">Loading your cart...</p>
      </div>
    );
  }

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] py-12 px-4 text-center">
        <ShoppingCart className="h-16 w-16 text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Your cart is empty
        </h2>
        <p className="text-gray-600 mb-6 max-w-md">
          Looks like you haven't added anything to your cart yet. Start shopping
          to find amazing products!
        </p>
        <Link
          to="/"
          className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + (item.product?.price || 0) * (item.quantity || 0),
    0
  );
  const tax = totalPrice * 0.1;
  const grandTotal = totalPrice + tax;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        <Link
          to="/"
          className="flex items-center text-indigo-600 hover:text-indigo-800 mr-4"
        >
          <ArrowLeft className="h-5 w-5 mr-1" />
          Continue Shopping
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 flex-grow text-center">
          Your Shopping Cart
        </h1>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Cart Items */}
        <div className="divide-y divide-gray-100">
          {cartItems.map((item) => (
            <div
              key={item._id || item.product?._id}
              className="flex p-4 sm:p-6"
            >
              
              {/* Product Image (Placeholder) */}
              <div
                className="bg-gray-200 border-2 border-dashed rounded-xl w-24 h-24 flex-shrink-0"
                style={{
                  backgroundImage: `url(${item.product.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />

              <div className="flex-grow ml-4 sm:ml-6">
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900 text-lg">
                      {item.product?.name || "Unnamed product"}
                    </h3>
                    <p className="text-gray-500 text-sm mt-1">
                      ${(item.product?.price || 0).toFixed(2)} per item
                    </p>
                  </div>
                  <button
                    onClick={() => removeCartItem(item.product?._id)}
                    className="text-gray-400 hover:text-red-500 transition-colors ml-4"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                    <button
                      className="px-3 py-1 bg-gray-100 hover:bg-gray-200 transition-colors"
                      onClick={() =>
                        updateCartItem(
                          item.product?._id,
                          Math.max((item.quantity || 0) - 1, 1)
                        )
                      }
                      disabled={item.quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="px-4 py-1 text-center w-12 font-medium">
                      {item.quantity || 0}
                    </span>
                    <button
                      className="px-3 py-1 bg-gray-100 hover:bg-gray-200 transition-colors"
                      onClick={() =>
                        updateCartItem(
                          item.product?._id,
                          (item.quantity || 0) + 1
                        )
                      }
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>

                  <p className="text-lg font-bold text-gray-900">
                    $
                    {(
                      (item.product?.price || 0) * (item.quantity || 0)
                    ).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="bg-gray-50 p-6 border-t">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Order Summary
          </h2>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">${totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping</span>
              <span className="font-medium text-green-600">Free</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tax</span>
              <span className="font-medium">${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between pt-3 border-t border-gray-200">
              <span className="text-lg font-bold text-gray-900">Total</span>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                ${grandTotal.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <button
              onClick={clearCart}
              className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition-colors flex items-center justify-center"
            >
              Clear Cart
            </button>
            <Link to={`/checkout`} className="flex-grow px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center justify-center">
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>

      {/* Security Badges */}
      <div className="mt-8 flex justify-center gap-6">
        <div className="flex items-center">
          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-6 mr-2" />
          <span className="text-sm text-gray-600">Secure Payment</span>
        </div>
        <div className="flex items-center">
          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-6 mr-2" />
          <span className="text-sm text-gray-600">Money Back Guarantee</span>
        </div>
      </div>
    </div>
  );
};

export default Cart;
