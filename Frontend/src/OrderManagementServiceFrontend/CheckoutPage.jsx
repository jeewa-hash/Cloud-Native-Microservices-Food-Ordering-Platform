import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { 
  MapPin, 
  Phone, 
  Truck, 
  Zap, 
  ShoppingBag, 
  CreditCard,
  Clock,
  Package,
  AlertCircle,
  CheckCircle,
  XCircle,
  Store,
  FileText,
} from "lucide-react";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState({ items: [] });
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [deliveryType, setDeliveryType] = useState("standard");
  const [instructions, setInstructions] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch cart
  const fetchCart = async () => {
    try {
      setFetchLoading(true);
      const token = localStorage.getItem("token");
      
      if (!token) {
        navigate("/login");
        return;
      }

      const res = await axios.get("http://localhost:4000/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (res.data.success) {
        setCart(res.data.cart);
      }
    } catch (err) {
      console.error("Error fetching cart:", err);
      setError("Failed to load cart. Please try again.");
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // Group items by shop
  const itemsByShop = {};
  cart.items?.forEach(item => {
    const shopId = item.shop?._id || 'unknown';
    const shopName = item.shop?.name || 'Unknown Shop';
    const shopLogo = item.shop?.logo;
    
    if (!itemsByShop[shopId]) {
      itemsByShop[shopId] = {
        shopId,
        shopName,
        shopLogo,
        items: [],
        subtotal: 0
      };
    }
    itemsByShop[shopId].items.push(item);
    itemsByShop[shopId].subtotal += item.price * item.quantity;
  });

  // Calculate totals
  const totalPrice = cart.items?.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  ) || 0;

  const deliveryFee = deliveryType === "express" ? 250 : 109;
  const grandTotal = totalPrice + deliveryFee;

  // Generate invoice number
  const generateInvoiceNumber = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `INV-${year}${month}${day}-${random}`;
  };

  const invoiceNumber = generateInvoiceNumber();

  // Handle checkout submit
  const handleCheckout = async () => {
    // Validation
    if (!address.trim()) {
      setError("Address is required");
      return;
    }
    if (!phone.trim()) {
      setError("Phone number is required");
      return;
    }
    if (!/^[0-9+\-\s]+$/.test(phone)) {
      setError("Please enter a valid phone number");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem("token");
      
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await axios.post(
        "http://localhost:4000/api/order/checkout",
        {
          address: address.trim(),
          phone: phone.trim(),
          deliveryType,
          instructions: instructions.trim() || "",
          shippingFee: deliveryFee
        },
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          } 
        }
      );

      if (response.data.success) {
        alert("✅ Order placed successfully! You can track your order status in the order history.");
        navigate("/order-history");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      
      if (err.response?.status === 401) {
        setError("Your session has expired. Please login again.");
        localStorage.removeItem("token");
        setTimeout(() => navigate("/login"), 2000);
      } else if (err.response?.status === 400) {
        setError(err.response.data?.message || "Invalid checkout data");
      } else if (err.response?.status === 404) {
        setError("Checkout service not available. Please try again later.");
      } else {
        setError(err.response?.data?.message || "Checkout failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Format price
  const formatPrice = (price) => {
    return `LKR ${price?.toLocaleString() || 0}`;
  };

  
  // Loading state
  if (fetchLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your cart...</p>
        </div>
      </div>
    );
  }

  // Empty cart state
  if (!cart.items?.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white rounded-2xl shadow-lg p-12">
            <ShoppingBag className="mx-auto text-gray-400 mb-4" size={64} />
            <h2 className="text-2xl font-bold text-gray-700 mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-6">Add some items to your cart before checking out</p>
            <button
              onClick={() => navigate("/")}
              className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-3 rounded-xl font-bold hover:from-orange-600 hover:to-orange-700 transition-all transform hover:scale-105 shadow-lg"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            Complete Your Order
          </h1>
          <p className="text-gray-600 mt-2">Just a few more details and you're done!</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg flex items-start">
            <XCircle className="text-red-500 mr-3 flex-shrink-0" size={20} />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Invoice Preview */}
        <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl shadow-lg p-6 mb-6 border-2 border-orange-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <FileText className="text-orange-600 mr-2" size={24} />
              <h2 className="text-xl font-bold text-orange-800">Invoice Preview</h2>
            </div>
           
          </div>
          
          <div className="bg-white rounded-xl p-4">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-200">
              <div>
                <p className="text-sm text-gray-500">Invoice #: {invoiceNumber}</p>
                <p className="text-sm text-gray-500">Date: {new Date().toLocaleDateString()}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Delivery: {deliveryType === 'express' ? 'Express' : 'Standard'}</p>
              </div>
            </div>

            {/* Single Invoice with Multiple Shops */}
            <div className="space-y-4">
              {Object.entries(itemsByShop).map(([shopId, shopData], index) => (
                <div key={shopId} className={index > 0 ? 'border-t border-gray-200 pt-4' : ''}>
                  <div className="flex items-center mb-2">
                    <Store className="text-orange-600 mr-2" size={16} />
                    <h3 className="font-semibold text-gray-800">{shopData.shopName}</h3>
                  </div>
                  
                  {/* Shop Items Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-2 py-1 text-left text-gray-600">Item</th>
                          <th className="px-2 py-1 text-center text-gray-600">Qty</th>
                          <th className="px-2 py-1 text-right text-gray-600">Price</th>
                          <th className="px-2 py-1 text-right text-gray-600">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {shopData.items.map((item, idx) => (
                          <tr key={idx} className="border-b border-gray-100">
                            <td className="px-2 py-2">
                              <div className="flex items-center">
                                {item.image ? (
                                  <img 
                                    src={item.image} 
                                    alt={item.name}
                                    className="w-8 h-8 object-cover rounded mr-2"
                                  />
                                ) : (
                                  <Package className="text-gray-400 mr-2" size={16} />
                                )}
                                <span className="font-medium">{item.name}</span>
                              </div>
                            </td>
                            <td className="px-2 py-2 text-center">{item.quantity}</td>
                            <td className="px-2 py-2 text-right">{formatPrice(item.price)}</td>
                            <td className="px-2 py-2 text-right font-medium">{formatPrice(item.price * item.quantity)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  {/* Shop Subtotal */}
                  <div className="flex justify-end mt-2">
                    <span className="text-sm text-gray-600 mr-4">Shop Subtotal:</span>
                    <span className="font-semibold text-orange-600">{formatPrice(shopData.subtotal)}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Grand Total */}
            <div className="mt-4 pt-4 border-t-2 border-gray-200">
              <div className="flex justify-end">
                <div className="w-64">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium">{formatPrice(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Delivery Fee:</span>
                    <span className="font-medium">{formatPrice(deliveryFee)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold">
                    <span className="text-gray-800">Grand Total:</span>
                    <span className="text-orange-600">{formatPrice(grandTotal)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Details Form */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <MapPin className="text-orange-600 mr-2" size={24} />
            Delivery Details
          </h2>
          
          <div className="space-y-4">
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Enter your delivery address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all outline-none"
                required
              />
            </div>

            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="tel"
                placeholder="Phone number for contact"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all outline-none"
                required
              />
            </div>

            <textarea
              placeholder="Additional instructions (gate code, landmark, etc.)"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              rows="3"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all outline-none resize-none"
            />
          </div>
        </div>

        {/* Delivery Method */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <Truck className="text-orange-600 mr-2" size={24} />
            Delivery Method
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label 
              className={`relative border-2 rounded-xl p-4 cursor-pointer transition-all
                ${deliveryType === 'standard' 
                  ? 'border-orange-500 bg-orange-50' 
                  : 'border-gray-200 hover:border-orange-300'}`}
            >
              <input
                type="radio"
                name="delivery"
                value="standard"
                checked={deliveryType === 'standard'}
                onChange={(e) => setDeliveryType(e.target.value)}
                className="sr-only"
              />
              <div className="flex items-start">
                <div className={`p-2 rounded-lg ${deliveryType === 'standard' ? 'bg-orange-500' : 'bg-gray-200'}`}>
                  <Clock className={`${deliveryType === 'standard' ? 'text-white' : 'text-gray-600'}`} size={20} />
                </div>
                <div className="ml-3 flex-1">
                  <p className="font-semibold">Standard Delivery</p>
                  <p className="text-sm text-gray-500">3-5 business days</p>
                  <p className="text-orange-600 font-bold mt-2">LKR 109</p>
                </div>
              </div>
              {deliveryType === 'standard' && (
                <div className="absolute top-2 right-2">
                  <CheckCircle className="text-orange-500" size={20} />
                </div>
              )}
            </label>

            <label 
              className={`relative border-2 rounded-xl p-4 cursor-pointer transition-all
                ${deliveryType === 'express' 
                  ? 'border-orange-500 bg-orange-50' 
                  : 'border-gray-200 hover:border-orange-300'}`}
            >
              <input
                type="radio"
                name="delivery"
                value="express"
                checked={deliveryType === 'express'}
                onChange={(e) => setDeliveryType(e.target.value)}
                className="sr-only"
              />
              <div className="flex items-start">
                <div className={`p-2 rounded-lg ${deliveryType === 'express' ? 'bg-orange-500' : 'bg-gray-200'}`}>
                  <Zap className={`${deliveryType === 'express' ? 'text-white' : 'text-gray-600'}`} size={20} />
                </div>
                <div className="ml-3 flex-1">
                  <p className="font-semibold">Express Delivery</p>
                  <p className="text-sm text-gray-500">1-2 business days</p>
                  <p className="text-orange-600 font-bold mt-2">LKR 250</p>
                </div>
              </div>
              {deliveryType === 'express' && (
                <div className="absolute top-2 right-2">
                  <CheckCircle className="text-orange-500" size={20} />
                </div>
              )}
            </label>
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center mb-3">
            <CreditCard className="text-orange-600 mr-2" size={24} />
            <h2 className="text-xl font-bold">Payment Method</h2>
          </div>
          <div className="bg-gray-50 p-4 rounded-xl">
            <p className="font-medium">Cash on Delivery</p>
          </div>
        </div>

        {/* Checkout Button */}
        <button
          onClick={handleCheckout}
          disabled={loading}
          className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4 rounded-xl font-bold 
            hover:from-orange-600 hover:to-orange-700 transform hover:scale-[1.02] transition-all 
            disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
            shadow-lg hover:shadow-xl text-lg"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : (
            `Place Order • ${formatPrice(grandTotal)}`
          )}
        </button>

       

        {/* Security Note */}
        <p className="text-xs text-center text-gray-400 mt-4">
          🔒 Your information is secure and encrypted
        </p>
      </div>
    </div>
  );
};

export default CheckoutPage;