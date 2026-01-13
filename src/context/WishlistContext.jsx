// src/context/WishlistContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { useCart } from "./CartContext";

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const { addToCart } = useCart();
  const [wishlistItems, setWishlistItems] = useState([]);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("wishlist");
    if (stored) {
      try {
        setWishlistItems(JSON.parse(stored));
      } catch {
        setWishlistItems([]);
      }
    }
  }, []);

  // Save to localStorage whenever wishlist changes
  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  const addToWishlist = (product) => {
    setWishlistItems((prev) => {
      if (prev.find((item) => item._id === product._id)) {
        return prev; // avoid duplicates
      }
      return [...prev, product];
    });
  };

  const removeFromWishlist = (productId) => {
    setWishlistItems((prev) => prev.filter((item) => item._id !== productId));
  };

  const moveToCart = (product) => {
    removeFromWishlist(product._id);
    addToCart(product, 1); // calls cart context
  };

  const clearWishlist = () => {
    setWishlistItems([]);
  };
  const isInWishlist = (productId) => {
  return wishlistItems.some((item) => item._id === productId);
};

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        addToWishlist,
        removeFromWishlist,
        moveToCart,
        clearWishlist,
        isInWishlist
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => useContext(WishlistContext);
