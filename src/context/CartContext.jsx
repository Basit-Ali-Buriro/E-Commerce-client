// src/context/CartContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

const CartContext = createContext();
const API = import.meta.env.VITE_API_URL || "";

const isValidObjectId = (id) => {
  return typeof id === "string" && /^[0-9a-fA-F]{24}$/.test(id);
};

const normalizeBackendItems = (resData) => {
  // backend may return { items: [...] , total } or directly a cart object
  const items = resData?.items ?? resData ?? [];
  // Ensure items is array
  return Array.isArray(items) ? items : [];
};

export function CartProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [cartItems, setCartItems] = useState([]); // array of { product, quantity }
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  // Load cart on mount: if authenticated => fetch backend, else => load localStorage
  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      const stored = localStorage.getItem("guest_cart");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setCartItems(parsed.items ?? parsed);
          setTotal(parsed.total ?? calculateTotal(parsed));
        } catch {
          setCartItems([]);
          setTotal(0);
        }
      } else {
        setCartItems([]);
        setTotal(0);
      }
    }
  }, [isAuthenticated]);

  // Persist guest cart whenever it changes
  useEffect(() => {
    if (!isAuthenticated) {
      const payload = { items: cartItems, total };
      localStorage.setItem("guest_cart", JSON.stringify(payload));
    }
  }, [cartItems, total, isAuthenticated]);

  const calculateTotal = (items) =>
    (items || []).reduce(
      (sum, it) => sum + (it.quantity || it.qty || 0) * (it.product?.price ?? 0),
      0
    );

  // fetchCart - pull from backend and set state
  const fetchCart = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      const res = await axios.get(`${API}/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const items = normalizeBackendItems(res.data);
      setCartItems(items);
      setTotal(res.data.total ?? calculateTotal(items));
    } catch (err) {
      console.error("Error fetching cart:", err.response?.data ?? err.message);
      setCartItems([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  /**
   * addToCart accepts either:
   *  - addToCart(productObject, quantity) where productObject has ._id or .id and price, name etc.
   *  - addToCart(productIdString, quantity)
   */
  const addToCart = async (productOrId, quantity = 1) => {
    // resolve id and product metadata for local fallback
    let productId = null;
    let productMeta = null;

    if (typeof productOrId === "string") {
      productId = productOrId;
    } else if (productOrId && typeof productOrId === "object") {
      productId = productOrId._id ?? productOrId.id ?? null;
      productMeta = productOrId;
    } else {
      console.warn("addToCart: invalid product param", productOrId);
      return;
    }

    // Local optimistic update / guest handling
    const applyLocalAdd = () => {
      // normalize into backend-like item shape: { product: { ... }, quantity }
      // if productMeta exists use it, else create a minimal product object
      const product = productMeta ?? { _id: productId, name: "Item", price: 0 };
      setCartItems((prev) => {
        const existing = prev.find((it) => (it.product?._id ?? it.product?.id) === productId);
        if (existing) {
          const updated = prev.map((it) =>
            (it.product?._id ?? it.product?.id) === productId
              ? { ...it, quantity: (it.quantity || it.qty || 0) + quantity }
              : it
          );
          setTotal(calculateTotal(updated));
          return updated;
        } else {
          const updated = [...prev, { product, quantity }];
          setTotal(calculateTotal(updated));
          return updated;
        }
      });
    };

    // If user not authenticated -> only local
    if (!isAuthenticated) {
      applyLocalAdd();
      return;
    }

    // Authenticated: ensure we have a valid ObjectId before calling backend
    if (!isValidObjectId(productId)) {
      console.warn(
        `Authenticated addToCart: productId "${productId}" is not a valid Mongo ObjectId. Falling back to local-only cart. Consider storing the DB product _id on product objects.`
      );
      applyLocalAdd();
      return;
    }

    // Call backend
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      const res = await axios.post(
        `${API}/cart/add`,
        { productId, quantity }, // EXACT keys backend expects
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
      );

      const items = normalizeBackendItems(res.data);
      setCartItems(items);
      setTotal(res.data.total ?? calculateTotal(items));
    } catch (err) {
      // Backend returned 400 -> likely invalid id or quantity; log details and fallback to local
      console.error("Error adding to cart:", err.response?.data ?? err.message);
      // fallback to local optimistic update so user doesn't lose UX
      applyLocalAdd();
    } finally {
      setLoading(false);
    }
  };

  const updateCartItem = async (productId, quantity) => {
    if (quantity < 1) return;

    // Local optimistic first
    setCartItems((prev) =>
      prev.map((it) =>
        (it.product?._id ?? it.product?.id) === productId ? { ...it, quantity } : it
      )
    );
    setTotal((prevItems) => calculateTotal(cartItems));

    if (!isAuthenticated) return;

    if (!isValidObjectId(productId)) {
      console.warn("updateCartItem: productId not valid ObjectId — update only local");
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      const res = await axios.put(
        `${API}/cart/update`,
        { productId, quantity },
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
      );
      const items = normalizeBackendItems(res.data);
      setCartItems(items);
      setTotal(res.data.total ?? calculateTotal(items));
    } catch (err) {
      console.error("Error updating cart item:", err.response?.data ?? err.message);
      // optionally refetch
      fetchCart();
    }
  };

  const removeCartItem = async (productId) => {
    // local optimistic
    setCartItems((prev) => prev.filter((it) => (it.product?._id ?? it.product?.id) !== productId));
    setTotal(calculateTotal(cartItems));

    if (!isAuthenticated) return;

    if (!isValidObjectId(productId)) {
      console.warn("removeCartItem: productId not valid ObjectId — removed locally only");
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      const res = await axios.delete(`${API}/cart/remove`, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        data: { productId }, // backend expects productId in body
      });
      const items = normalizeBackendItems(res.data);
      setCartItems(items);
      setTotal(res.data.total ?? calculateTotal(items));
    } catch (err) {
      console.error("Error removing cart item:", err.response?.data ?? err.message);
      fetchCart();
    }
  };

  const clearCart = async () => {
    // local clear
    setCartItems([]);
    setTotal(0);

    if (!isAuthenticated) return;

    try {
      const token = localStorage.getItem("authToken");
      await axios.delete(`${API}/cart/clear`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      console.error("Error clearing cart:", err.response?.data ?? err.message);
      fetchCart();
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        total,
        loading,
        fetchCart,
        addToCart,
        updateCartItem,
        removeCartItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
