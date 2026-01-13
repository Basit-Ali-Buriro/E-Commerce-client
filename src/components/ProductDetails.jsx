import { useParams, useNavigate } from "react-router-dom";
import { useProducts } from "../context/ProductContext";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useEffect, useState } from "react";
import { Heart, ArrowLeft, ShoppingBag, Share2, Star, ChevronLeft, ChevronRight, Loader } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProductById, loading, error } = useProducts();
  const { addToCart } = useCart();
  const { wishlistItems, addToWishlist, removeFromWishlist, isInWishlist } =
    useWishlist();

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isWishlistProcessing, setIsWishlistProcessing] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: "" });

  useEffect(() => {
    const found = getProductById(id);
    if (found) {
      setProduct(found);
      // If product has images, set first as selected
      if (found.images && found.images.length > 0) {
        setSelectedImage(0);
      }
      // Pre-select first available size if exists
      if (found.sizes && found.sizes.length > 0) {
        setSelectedSize(found.sizes[0].size);
      }
    }
  }, [id, getProductById]);

  const handleWishlistToggle = async () => {
    setIsWishlistProcessing(true);
    if (isInWishlist(product._id)) {
      await removeFromWishlist(product._id);
      showNotification("Removed from wishlist");
    } else {
      await addToWishlist(product);
      showNotification("Added to wishlist");
    }
    setIsWishlistProcessing(false);
  };

  const handleAddToCart = async () => {
    if (!selectedSize && product.sizes && product.sizes.length > 0) {
      showNotification("Please select a size");
      return;
    }
    
    setIsAddingToCart(true);
    
    // Find selected size object to get stock info
    const sizeObj = product.sizes?.find(s => s.size === selectedSize);
    
    // Prepare product data with selected size
    const productToAdd = {
      ...product,
      selectedSize: selectedSize,
      // Include stock info if needed
      stock: sizeObj?.stock
    };
    
    await addToCart(productToAdd, quantity);
    showNotification("Added to cart!");
    setIsAddingToCart(false);
  };

  const showNotification = (message) => {
    setNotification({ show: true, message });
    setTimeout(() => setNotification({ show: false, message: "" }), 3000);
  };

  const nextImage = () => {
    if (product.images && product.images.length > 0) {
      setSelectedImage((prev) => (prev + 1) % product.images.length);
    }
  };

  const prevImage = () => {
    if (product.images && product.images.length > 0) {
      setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length);
    }
  };

  // Calculate total stock across all sizes
  const calculateTotalStock = () => {
    if (!product.sizes || product.sizes.length === 0) return 0;
    return product.sizes.reduce((total, size) => total + size.stock, 0);
  };

  // Check if selected size is in stock
  const isSizeInStock = (size) => {
    const sizeObj = product.sizes?.find(s => s.size === size);
    return sizeObj && sizeObj.stock > 0;
  };

  // Calculate average rating
  const averageRating = product?.ratings?.length > 0 
    ? (product.ratings.reduce((sum, r) => sum + r.value, 0) / product.ratings.length).toFixed(1)
    : 0;

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600">
        <Loader className="h-8 w-8 text-indigo-600" />
      </div>
    </div>
  );
  
  if (error) return (
    <div className="max-w-7xl mx-auto p-6 text-center min-h-screen flex flex-col justify-center">
      <div className="bg-red-50 text-red-600 p-8 rounded-xl max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Error Loading Product</h2>
        <p className="mb-6">{error}</p>
        <button 
          onClick={() => navigate(-1)} 
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
        >
          Go Back
        </button>
      </div>
    </div>
  );
  
  if (!product) return (
    <div className="max-w-7xl mx-auto p-6 text-center min-h-screen flex flex-col justify-center">
      <div className="bg-gray-50 p-8 rounded-xl max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
        <p className="mb-6">The product you're looking for doesn't exist or has been removed.</p>
        <button 
          onClick={() => navigate("/")} 
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      {/* Notification */}
      <AnimatePresence>
        {notification.show && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50"
          >
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Breadcrumb */}
      <div className="flex items-center text-sm text-gray-500 mb-6">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center text-indigo-600 hover:text-indigo-800"
        >
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </button>
        <span className="mx-2">/</span>
        <span>{product.category || 'Product'}</span>
        <span className="mx-2">/</span>
        <span className="font-medium text-gray-900">{product.name}</span>
      </div>

      {/* Product Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Product Images */}
        <div className="relative">
          {/* Main Image */}
          <div className="bg-gray-100 rounded-xl overflow-hidden aspect-square relative">
            {product.images && product.images.length > 0 ? (
              <>
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-contain transition-opacity duration-300"
                />
                <button 
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white transition-colors"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button 
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white transition-colors"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                <ShoppingBag className="h-20 w-20 text-gray-400" />
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-3 mt-4 overflow-x-auto py-2">
              {product.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                    selectedImage === index ? 'border-indigo-600' : 'border-transparent'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <div className="flex items-center mb-4">
                {averageRating > 0 && (
                  <>
                    <div className="flex items-center mr-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${
                            i < Math.floor(averageRating) 
                              ? 'text-yellow-400 fill-current' 
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-gray-600 mr-4">{averageRating} ({product.ratings?.length} reviews)</span>
                  </>
                )}
                <span className="text-gray-500">SKU: {product.sku || 'N/A'}</span>
              </div>
            </div>
            
            {/* Wishlist Button */}
            <button
              onClick={handleWishlistToggle}
              disabled={isWishlistProcessing}
              className={`p-2 rounded-full ${
                isInWishlist(product._id)
                  ? 'text-red-500 bg-red-50'
                  : 'text-gray-500 bg-gray-100 hover:bg-gray-200'
              } transition-colors`}
            >
              {isWishlistProcessing ? (
                <Loader className="h-6 w-6 animate-spin" />
              ) : (
                <Heart 
                  className="h-6 w-6" 
                  fill={isInWishlist(product._id) ? "currentColor" : "none"} 
                />
              )}
            </button>
          </div>

          <div className="mb-6">
            <div className="flex items-baseline gap-3 mb-4">
              <p className="text-3xl font-bold text-gray-900">
                ${product.price.toFixed(2)}
              </p>
              {product.originalPrice > product.price && (
                <p className="text-xl text-gray-500 line-through">
                  ${product.originalPrice.toFixed(2)}
                </p>
              )}
              {product.originalPrice > product.price && (
                <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-sm font-bold">
                  Save {Math.round((1 - product.price / product.originalPrice) * 100)}%
                </span>
              )}
            </div>

            <p className="text-gray-700 mb-4">{product.description}</p>

            {/* Size Selector */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Select Size</h3>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((sizeObj) => (
                    <button
                      key={sizeObj._id}
                      onClick={() => setSelectedSize(sizeObj.size)}
                      disabled={sizeObj.stock === 0}
                      className={`px-4 py-2 rounded-lg border-2 ${
                        selectedSize === sizeObj.size
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                          : 'border-gray-300 hover:border-gray-500'
                      } ${
                        sizeObj.stock === 0
                          ? 'opacity-50 cursor-not-allowed line-through'
                          : 'hover:bg-gray-50'
                      } transition-all relative`}
                    >
                      {sizeObj.size}
                      {sizeObj.stock === 0 && (
                        <span className="absolute top-0 right-0 text-xs text-red-600">X</span>
                      )}
                    </button>
                  ))}
                </div>
                
                {/* Stock Information */}
                <div className="mt-3 text-sm text-gray-600">
                  {selectedSize && (
                    <p>
                      {isSizeInStock(selectedSize) 
                        ? `In stock: ${product.sizes.find(s => s.size === selectedSize).stock} available`
                        : "Out of stock"}
                    </p>
                  )}
                  <p className="mt-1">Total stock: {calculateTotalStock()} units available</p>
                </div>
              </div>
            )}

            {product.details && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Product Details</h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Object.entries(product.details).map(([key, value]) => (
                    <li key={key} className="flex">
                      <span className="text-gray-600 font-medium w-32">{key}:</span>
                      <span className="text-gray-800">{value}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Quantity Selector */}
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Quantity</label>
            <div className="flex items-center">
              <button
                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                className="bg-gray-100 text-gray-600 px-4 py-2 rounded-l-lg hover:bg-gray-200 transition-colors"
              >
                -
              </button>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-16 text-center py-2 border-y border-gray-200"
              />
              <button
                onClick={() => setQuantity((prev) => prev + 1)}
                className="bg-gray-100 text-gray-600 px-4 py-2 rounded-r-lg hover:bg-gray-200 transition-colors"
              >
                +
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleAddToCart}
              disabled={
                isAddingToCart || 
                (product.sizes && product.sizes.length > 0 && !isSizeInStock(selectedSize))
              }
              className={`flex-1 flex items-center justify-center py-4 px-6 rounded-lg font-medium transition-all ${
                (product.sizes && product.sizes.length > 0 && !isSizeInStock(selectedSize))
                  ? 'bg-gray-300 cursor-not-allowed' 
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
            >
              {isAddingToCart ? (
                <>
                  <Loader className="h-5 w-5 animate-spin mr-2" />
                  Adding...
                </>
              ) : (product.sizes && product.sizes.length > 0 && !isSizeInStock(selectedSize)) ? (
                "Out of Stock"
              ) : (
                <>
                  <ShoppingBag className="h-5 w-5 mr-2" />
                  Add to Cart
                </>
              )}
            </button>

            <button
              onClick={() => {
                handleAddToCart();
                navigate("/cart");
              }}
              disabled={
                isAddingToCart || 
                (product.sizes && product.sizes.length > 0 && !isSizeInStock(selectedSize))
              }
              className={`py-4 px-6 rounded-lg font-medium transition-all ${
                (product.sizes && product.sizes.length > 0 && !isSizeInStock(selectedSize))
                  ? 'bg-gray-300 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-gray-800 to-black hover:opacity-90 text-white'
              }`}
            >
              Buy Now
            </button>
          </div>

          {/* Share */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold mb-3">Share this product</h3>
            <div className="flex gap-3">
              <button className="bg-gray-100 p-3 rounded-full hover:bg-gray-200 transition-colors">
                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </button>
              <button className="bg-gray-100 p-3 rounded-full hover:bg-gray-200 transition-colors">
                <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.06 10.06 0 01-3.127 1.195 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.937 4.937 0 004.604 3.417 9.868 9.868 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.054 0 13.999-7.496 13.999-13.986 0-.209 0-.42-.015-.63a9.935 9.935 0 002.46-2.548l-.047-.02z"/>
                </svg>
              </button>
              <button className="bg-gray-100 p-3 rounded-full hover:bg-gray-200 transition-colors">
                <Share2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews */}
      {product.ratings?.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
          <div className="space-y-6">
            {product.ratings.map((review, index) => (
              <div key={index} className="border-b pb-6">
                <div className="flex items-center mb-3">
                  <div className="flex mr-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < review.value 
                            ? 'text-yellow-400 fill-current' 
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <h3 className="font-medium">{review.title}</h3>
                </div>
                <p className="text-gray-600 mb-2">{review.comment}</p>
                <p className="text-sm text-gray-500">By {review.user || 'Anonymous'}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Related Products */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-xl aspect-[3/4] flex items-center justify-center">
              <div className="text-center p-4">
                <ShoppingBag className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">Featured product</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;