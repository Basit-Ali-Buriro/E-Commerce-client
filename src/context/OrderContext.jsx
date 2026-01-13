// src/context/OrderContext.jsx
import React, { createContext, useContext, useState } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

const OrderContext = createContext();
const API = import.meta.env.VITE_API_URL || "";

export const OrderProvider = ({ children }) => {
  const { isAuthenticated, logout } = useAuth(); // optional logout
  const [myOrders, setMyOrders] = useState([]);
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  const getTokenHeader = () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.error("No auth token found in localStorage");
      return null;
    }
    return { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
  };

  const fetchMyOrders = async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const headers = getTokenHeader();
      if (!headers) return;
      const res = await axios.get(`${API}/orders/myorders`, { headers });
      setMyOrders(res.data);
    } catch (err) {
      console.error("Error fetching orders:", err.response?.data ?? err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderById = async (id) => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const headers = getTokenHeader();
      if (!headers) return;
      const res = await axios.get(`${API}/orders/${id}`, { headers });
      setOrderDetails(res.data);
    } catch (err) {
      console.error("Error fetching order:", err.response?.data ?? err.message);
    } finally {
      setLoading(false);
    }
  };

  const createOrder = async (orderData) => {
    if (!isAuthenticated) {
      console.warn("User not authenticated");
      return null;
    }
    setLoading(true);
    try {
      const headers = getTokenHeader();
      if (!headers) return null;
      const res = await axios.post(`${API}/orders`, orderData, { headers });
      return res.data;
    } catch (err) {
      if (err.response?.status === 401) {
        console.error("Token failed or expired. Logging out...");
        logout?.(); // optional logout
      } else {
        console.error("Error creating order:", err.response?.data ?? err.message);
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  const payOrder = async (orderId, paymentResult) => {
    if (!isAuthenticated) return null;
    setLoading(true);
    try {
      const headers = getTokenHeader();
      if (!headers) return null;
      const res = await axios.put(`${API}/orders/${orderId}/pay`, paymentResult, { headers });
      return res.data;
    } catch (err) {
      console.error("Error paying order:", err.response?.data ?? err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async (orderId) => {
    if (!isAuthenticated) return null;
    setLoading(true);
    try {
      const headers = getTokenHeader();
      if (!headers) return null;
      const res = await axios.put(`${API}/orders/${orderId}/cancel`, {}, { headers });
      return res.data;
    } catch (err) {
      console.error("Error cancelling order:", err.response?.data ?? err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return (
    <OrderContext.Provider
      value={{
        myOrders,
        orderDetails,
        loading,
        fetchMyOrders,
        fetchOrderById,
        createOrder,
        payOrder,
        cancelOrder,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => useContext(OrderContext);
