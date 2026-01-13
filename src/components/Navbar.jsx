import { useState, useEffect } from "react";
import { ShoppingBag, ShoppingCart, Menu, X, User, UserCheck, Heart, Search } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext"; // Import wishlist context

function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems } = useCart();
  const { isAuthenticated, logout } = useAuth();
  const { wishlistItems } = useWishlist(); // Get wishlist items from context

  const cartLength = Object.values(cartItems).reduce(
    (total, item) => total + (item.qty || 1),
    0
  );

  // Calculate wishlist items count
  const wishlistLength = wishlistItems.length;

  // Track scroll position for navbar effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
      setMobileMenuOpen(false);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { name: "Shop", path: "/" },
    { name: "Men", path: "/men" },
    { name: "Women", path: "/women" },
    { name: "Kids", path: "/kids" },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/95 backdrop-blur-sm shadow-lg" : "bg-white shadow-md"
        }`}
    >
      {/* Announcement bar */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-center py-1.5 text-sm">
        Free shipping on orders over $50 •{" "}
        <span className="font-medium">SHOP15</span> for 15% off
      </div>

      <div className="max-w-7xl mx-auto px-4 py-3 md:px-8">
        <div className="flex items-center justify-between">
          {/* Brand */}
          <Link
            to="/"
            className="flex items-center space-x-2 group"
          >
            <ShoppingBag className="h-7 w-7 text-indigo-600 group-hover:rotate-12 transition-transform" />
            <span className="font-bold text-2xl text-gray-800 group-hover:text-indigo-600 transition-colors">
              E-Shop
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`relative px-1 py-2 font-medium ${location.pathname === link.path
                  ? "text-indigo-600"
                  : "text-gray-700 hover:text-black"
                  } transition-colors`}
              >
                {link.name}
                {location.pathname === link.path && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-full" />
                )}
              </Link>
            ))}
          </div>

          {/* Desktop Icons */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Search */}
            <form
              onSubmit={handleSearch}
              className={`relative flex items-center transition-all duration-300 ${isSearchFocused ? "w-64" : "w-40"
                }`}
            >
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className="w-full px-4 py-1.5 text-sm border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
              <button
                type="submit"
                className="absolute right-3 text-gray-400 hover:text-indigo-600 transition-colors"
              >
                <Search className="h-4 w-4" />
              </button>
            </form>

            {/* Account */}
            <div className="group relative">
              <Link
                to="/account"
                className={`p-2 transition-colors ${isAuthenticated
                  ? "text-green-600 hover:text-green-700"
                  : "text-gray-700 hover:text-indigo-600"
                  }`}
              >
                {isAuthenticated ? (
                  <UserCheck className="h-5 w-5" />
                ) : (
                  <User className="h-5 w-5" />
                )}
              </Link>

              {/* Account dropdown */}
              {isAuthenticated && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                  <Link
                    to="/account"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    My Account
                  </Link>
                  <Link
                    to="/orders"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    My Orders
                  </Link>
                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>

            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="p-2 text-gray-700 hover:text-indigo-600 transition-colors relative"
            >
              <Heart className="h-5 w-5" />
              {wishlistLength > 0 && (
                <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                  {wishlistLength}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className="p-2 text-gray-700 hover:text-indigo-600 transition-colors relative"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartLength > 0 && (
                <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                  {cartLength}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full h-[calc(100vh-100%)] bg-white border-t shadow-lg z-40 overflow-y-auto pb-20">
          <div className="px-4 py-3">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="flex mb-4">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-2 text-sm border border-gray-300 rounded-l-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <button
                type="submit"
                className="bg-indigo-600 text-white px-4 py-2 rounded-r-lg hover:bg-indigo-700 transition-colors"
              >
                <Search className="h-5 w-5" />
              </button>
            </form>

            {/* Mobile Nav Links */}
            <div className="space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`block px-4 py-2 rounded-lg ${location.pathname === link.path
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-gray-700 hover:bg-gray-100"
                    }`}
                >
                  {link.name}
                </Link>
              ))}

              {/* Account Links */}
              <div className="border-t pt-2 mt-2">
                <Link
                  to="/account"
                  className={`flex items-center px-4 py-2 rounded-lg ${location.pathname === "/account"
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-gray-700 hover:bg-gray-100"
                    }`}
                >
                  <span className="mr-2">
                    {isAuthenticated ? <UserCheck className="h-5 w-5" /> : <User className="h-5 w-5" />}
                  </span>
                  {isAuthenticated ? "My Account" : "Sign In"}
                </Link>

                {isAuthenticated && (
                  <>
                    <Link
                      to="/orders"
                      className="flex items-center px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100"
                    >
                      My Orders
                    </Link>
                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100"
                    >
                      Sign Out
                    </button>
                  </>
                )}

                <Link
                  to="/wishlist"
                  className="flex items-center px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100"
                >
                  <Heart className="h-5 w-5 mr-2" />
                  Wishlist {wishlistLength > 0 && `(${wishlistLength})`}
                </Link>

                <Link
                  to="/cart"
                  className="flex items-center px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Cart {cartLength > 0 && `(${cartLength})`}
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;