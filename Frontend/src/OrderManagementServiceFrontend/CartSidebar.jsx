import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { 
  ShoppingBag, 
  X, 
  Trash2, 
  Plus, 
  Minus,
  ArrowRight,
  ShoppingCart,
  Tag,
  Store,
  AlertCircle
} from "lucide-react";

const CartSidebar = ({ cart, setCart, isOpen, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate(); // <-- Added for navigation

  useEffect(() => {
    if (isOpen) setIsVisible(true);
    else {
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Update quantity
  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) return;
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        "http://localhost:4000/api/cart/update",
        { productId, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) setCart(res.data.cart);
    } catch (err) {
      console.error(err);
    }
  };

  // Remove item
  const removeFromCart = async (productId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.delete("http://localhost:4000/api/cart/remove", {
        data: { productId },
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) setCart(res.data.cart);
    } catch (err) {
      console.error(err);
    }
  };

  // Navigate to checkout page
  const handleCheckout = () => {
    onClose(); // Close sidebar
    navigate("/checkout"); // Navigate to checkout page
  };

  if (!isVisible) return null;

  const totalPrice = cart.items?.reduce((acc, item) => acc + item.price * item.quantity, 0) || 0;
  const totalItems = cart.items?.length || 0;

  // Group items by shop
  const itemsByShop = cart.items?.reduce((acc, item) => {
    const shopId = item.shop?._id || "unknown";
    if (!acc[shopId]) acc[shopId] = { shop: item.shop, items: [] };
    acc[shopId].items.push(item);
    return acc;
  }, {}) || {};

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-300 z-40 ${
          isOpen ? "opacity-50" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-[500px] bg-gradient-to-b from-gray-50 to-white shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="bg-white px-8 py-6 border-b border-gray-100 sticky top-0">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="relative">
                <ShoppingBag className="w-6 h-6 text-orange-600" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-orange-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Your Cart</h2>
                <p className="text-sm text-gray-500">
                  {totalItems} {totalItems === 1 ? 'item' : 'items'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors group"
            >
              <X className="w-5 h-5 text-gray-500 group-hover:text-orange-600" />
            </button>
          </div>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
          {!cart.items || cart.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-28 h-28 bg-orange-50 rounded-full flex items-center justify-center mb-4">
                <ShoppingCart className="w-14 h-14 text-orange-300" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Your cart is empty
              </h3>
              <p className="text-gray-500 mb-6 max-w-xs">
                Looks like you haven't added anything to your cart yet
              </p>
              <button
                onClick={onClose}
                className="px-8 py-4 bg-orange-600 text-white rounded-xl font-medium hover:bg-orange-700 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            Object.values(itemsByShop).map(({ shop, items }) => (
              <div key={shop?._id || "unknown"} className="space-y-4">
                {/* Shop heading */}
                {shop?.name && (
                  <div className="flex items-center gap-2 mb-2">
                    <Store className="w-4 h-4 text-gray-400" />
                    <h4 className="font-semibold text-gray-900">{shop.name}</h4>
                  </div>
                )}

                {/* Shop items */}
                {items.map((item, index) => (
                  <div
                    key={item.product}
                    className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100"
                    style={{
                      animation: `slideIn 0.3s ease-out ${index * 0.05}s both`
                    }}
                  >
                    <div className="flex gap-6">
                      <div className="w-24 h-24 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100">
                        <img
                          src={item.image || "https://via.placeholder.com/80"}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          onError={(e) => { e.target.src = "https://via.placeholder.com/80"; }}
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <h3 className="font-semibold text-gray-900 text-sm line-clamp-1">{item.name}</h3>
                          <button
                            onClick={() => removeFromCart(item.product)}
                            className="p-1.5 hover:bg-red-50 rounded-lg transition-colors group"
                          >
                            <Trash2 className="w-4 h-4 text-gray-400 group-hover:text-red-500" />
                          </button>
                        </div>

                        <div className="flex items-center gap-2 mt-2">
                          <Tag className="w-3 h-3 text-orange-600" />
                          <p className="text-sm font-semibold text-orange-600">
                            LKR {item.price.toLocaleString()}
                          </p>
                        </div>

                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1">
                            <button
                              onClick={() => updateQuantity(item.product, item.quantity - 1)}
                              className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm hover:bg-gray-100 transition-colors"
                            >
                              <Minus className="w-4 h-4 text-gray-600" />
                            </button>
                            <span className="w-8 text-center font-medium text-sm">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.product, item.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm hover:bg-gray-100 transition-colors"
                            >
                              <Plus className="w-4 h-4 text-gray-600" />
                            </button>
                          </div>
                          <p className="text-sm font-bold text-gray-900">
                            LKR {(item.price * item.quantity).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.items?.length > 0 && (
          <div className="bg-white border-t border-gray-100 px-8 py-6 space-y-5">
            <div className="border-t border-gray-100 pt-2 flex justify-between">
              <span className="font-bold text-gray-900">Total</span>
              <span className="font-bold text-xl text-orange-600">
                LKR {totalPrice.toLocaleString()}
              </span>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleCheckout}
                className="w-full bg-gradient-to-r from-orange-600 to-orange-500 text-white py-4 rounded-xl font-bold hover:from-orange-700 hover:to-orange-600 transition-all duration-300 flex items-center justify-center gap-2 group shadow-lg shadow-orange-200"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onClose}
                className="w-full py-3 text-gray-500 hover:text-orange-600 font-medium transition-colors flex items-center justify-center gap-2"
              >
                Continue Shopping
              </button>
            </div>

            <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
              <AlertCircle className="w-3 h-3" />
              <span>Secure checkout powered by E-Platform</span>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </>
  );
};

export default CartSidebar;