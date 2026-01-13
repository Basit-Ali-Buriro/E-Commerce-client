// src/context/OrderContext.jsx
import React, { createContext, useContext, useState } from "react";
import apiClient from "../api/apiClient";
import { useAuth } from "./AuthContext";

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const { isAuthenticated, logout } = useAuth(); // optional logout
  const [myOrders, setMyOrders] = useState([]);
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchMyOrders = async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const res = await apiClient.get('/orders/myorders');
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
      const res = await apiClient.get(`/orders/${id}`);
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
      const res = await apiClient.post('/orders', orderData);
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
      const res = await apiClient.put(`/orders/${orderId}/pay`, paymentResult);
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
      const res = await apiClient.put(`/orders/${orderId}/cancel`, {});
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
