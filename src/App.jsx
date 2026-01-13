import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import Home from "./pages/Home";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentCancel from "./pages/PaymentCancel";
import CheckOutPage from "./pages/CheckOutPage";
import Navbar from "./components/Navbar";
import Cart from "./pages/Cart";
import Account from "./pages/Account";
import Wishlist from "./pages/Wishlist";
import Footer from "./components/Footer";
import Men from "./pages/Men";
import Women from "./pages/Women";
import Kids from "./pages/Kids";
import ProductDetails from "./components/ProductDetails";
// import SignUp from "./pages/SignUp";
import ScrollToTop from "./components/ScrollToTop";

// Admin Components
import AdminLayout from "./components/admin/AdminLayout";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminSignup from "./pages/admin/AdminSignup";
import Dashboard from "./pages/admin/Dashboard";
import Products from "./pages/admin/Products";
import Orders from "./pages/admin/Orders";
import CreateProduct from "./pages/admin/CreateProduct";
import UpdateProduct from "./pages/admin/UpdateProduct"; // Import UpdateProduct component
import ProtectedAdminRoute from "./pages/admin/ProtectedAdminRoute";
import Customer from "./pages/admin/Customer";

function AppContent() {
  const location = useLocation();
  
  // All routes that start with "/admin"
  const isAdminRoute = location.pathname.startsWith("/admin");
  console.log(import.meta.env.VITE_API_URL);
  
  return (
    <>
      <ScrollToTop />
      
      {/* Show Navbar/Footer only if not on admin route */}
      {!isAdminRoute && <Navbar />}
      
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/men" element={<Men />} />
          <Route path="/women" element={<Women />} />
          <Route path="/kids" element={<Kids />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/account" element={<Account />} />
          {/* <Route path="/signup" element={<SignUp />} /> */}
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/checkout" element={<CheckOutPage />} />
          <Route path="/success" element={<PaymentSuccess />} />
          <Route path="/cancel" element={<PaymentCancel />} />
          
          {/* Admin Auth Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/signup" element={<AdminSignup />} />
          
          {/* Protected Admin Panel Routes */}
          <Route
            path="/admin"
            element={
              // <ProtectedAdminRoute>
                <AdminLayout />
              //  </ProtectedAdminRoute>
            }
          >
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="products" element={<Products />} />
            <Route path="orders" element={<Orders />} />
            <Route path="create-product" element={<CreateProduct />} />
            <Route path="update-product/:id" element={<UpdateProduct />} />
            <Route path="customers" element={<Customer />} />
          </Route>
        </Routes>
      </AnimatePresence>
      
      {!isAdminRoute && <Footer />}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;