import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { OrderProvider } from "./context/OrderContext.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import { WishlistProvider } from "./context/WishlistContext.jsx";
import { ProductProvider } from "./context/ProductContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* AuthProvider should be outermost for all authenticated contexts */}
    <AuthProvider>
      {/* OrderProvider may depend on Auth */}
      <OrderProvider>
        {/* CartProvider may depend on Auth (guest or logged-in) */}
        <CartProvider>
          {/* WishlistProvider may depend on Cart/Auth */}
          <WishlistProvider>
            {/* ProductProvider is independent, can be innermost */}
            <ProductProvider>
              <App />
            </ProductProvider>
          </WishlistProvider>
        </CartProvider>
      </OrderProvider>
    </AuthProvider>
  </StrictMode>
);
