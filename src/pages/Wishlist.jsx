import React, { useState } from "react";
import { Heart, ShoppingBag, X, ArrowLeft, Loader, Trash2, Check } from "lucide-react";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const Wishlist = () => {
  const { wishlistItems, removeFromWishlist, loading: wishlistLoading } = useWishlist();
  const { addToCart } = useCart(); // <-- CartContext hook

  const [removingId, setRemovingId] = useState(null);
  const [movingToCartId, setMovingToCartId] = useState(null);
  const [addedToCart, setAddedToCart] = useState({});

  const handleRemove = async (id) => {
    setRemovingId(id);
    await removeFromWishlist(id);
    setRemovingId(null);
  };

  const handleMoveToCart = async (item) => {
    setMovingToCartId(item._id);

    // Add to Cart via CartContext
    addToCart(item, 1); // quantity = 1

    // Remove from Wishlist
    await removeFromWishlist(item._id);

    // Show added feedback
    setAddedToCart(prev => ({ ...prev, [item._id]: true }));
    setTimeout(() => {
      setMovingToCartId(null);
      setAddedToCart(prev => {
        const newState = { ...prev };
        delete newState[item._id];
        return newState;
      });
    }, 2000);
  };

  if (wishlistLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] py-12">
        <Loader className="h-12 w-12 text-indigo-600 animate-spin mb-4" />
        <p className="text-lg text-gray-600">Loading your wishlist...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center mb-8 gap-4">
        <Link 
          to="/" 
          className="flex items-center text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" /> Continue Shopping
        </Link>
        <div className="flex items-center">
          <h1 className="text-2xl sm:text-3xl font-bold">My Wishlist</h1>
          <span className="ml-4 bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
            {wishlistItems.length} item{wishlistItems.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Wishlist Grid */}
      <AnimatePresence>
        {wishlistItems.length > 0 ? (
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistItems.map((item) => (
              <motion.div
                layout
                key={item._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: removingId === item._id ? 0 : 1, 
                  y: 0,
                  scale: removingId === item._id ? 0.95 : 1
                }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-all"
              >
                <div className="relative">
                  {/* Product Image */}
                  <div className="aspect-square bg-gray-100 relative">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                        <ShoppingBag className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col items-start">
                    {item.originalPrice > item.price && (
                      <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded mb-2">
                        {Math.round((1 - item.price / item.originalPrice) * 100)}% OFF
                      </span>
                    )}
                    {!item.inStock && (
                      <span className="bg-gray-600 text-white text-xs font-bold px-2 py-1 rounded">
                        OUT OF STOCK
                      </span>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="absolute top-3 right-3 flex flex-col gap-2">
                    <button
                      onClick={() => handleRemove(item._id)}
                      className="bg-white p-2 rounded-full shadow-md text-gray-600 hover:text-red-500 hover:bg-red-50 transition-colors"
                      disabled={removingId === item._id}
                    >
                      {removingId === item._id ? <Loader className="h-5 w-5 animate-spin" /> : <X className="h-5 w-5" />}
                    </button>
                    <button
                      onClick={() => handleMoveToCart(item)}
                      className="bg-white p-2 rounded-full shadow-md text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                      disabled={!item.inStock || movingToCartId === item._id || addedToCart[item._id]}
                    >
                      {addedToCart[item._id] ? (
                        <Check className="h-5 w-5 text-green-500" />
                      ) : movingToCartId === item._id ? (
                        <Loader className="h-5 w-5 animate-spin" />
                      ) : (
                        <ShoppingBag className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <Link to={`/product/${item._id}`}>
                    <h3 className="font-medium text-gray-900 mb-1 line-clamp-2 hover:text-indigo-600 transition-colors">
                      {item.title}
                    </h3>
                  </Link>
                  <div className="flex items-center mt-2">
                    {item.originalPrice > item.price ? (
                      <>
                        <span className="text-lg font-bold text-gray-900">${item.price.toFixed(2)}</span>
                        <span className="ml-2 text-sm text-gray-500 line-through">${item.originalPrice.toFixed(2)}</span>
                      </>
                    ) : (
                      <span className="text-lg font-bold text-gray-900">${item.price.toFixed(2)}</span>
                    )}
                  </div>

                  <div className="mt-3 flex justify-between items-center">
                    {item.inStock ? (
                      <span className="text-sm font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
                        In Stock
                      </span>
                    ) : (
                      <button className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">
                        Notify Me
                      </button>
                    )}

                    <button
                      onClick={() => handleRemove(item._id)}
                      className="text-sm font-medium text-gray-500 hover:text-red-500 flex items-center transition-colors"
                      disabled={removingId === item._id}
                    >
                      <Trash2 className="h-4 w-4 mr-1" /> Remove
                    </button>
                  </div>

                  {/* Added to Cart Confirmation */}
                  {addedToCart[item._id] && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-3 bg-green-50 text-green-700 px-3 py-2 rounded-md text-sm flex items-center"
                    >
                      <Check className="h-4 w-4 mr-2" /> Added to cart!
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          // Empty Wishlist
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm p-8 sm:p-12 text-center max-w-2xl mx-auto"
          >
            <motion.div 
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="bg-indigo-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <Heart className="h-10 w-10 text-indigo-600" fill="currentColor" />
            </motion.div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Your wishlist is empty</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Looks like you haven't added anything to your wishlist yet. Start exploring our collection!
            </p>
            <Link 
              to="/" 
              className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium py-3 px-8 rounded-lg transition-all shadow-md hover:shadow-lg"
            >
              Browse Products
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Wishlist;
