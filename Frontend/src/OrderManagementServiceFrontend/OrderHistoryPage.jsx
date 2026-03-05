import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  ChevronRight,
  ShoppingBag,
  MapPin,
  Phone,
  Calendar,
  CreditCard,
  AlertCircle,
  Store,
  Eye,
  ChevronDown,
  ChevronUp,
  Download,
  Image as ImageIcon
} from "lucide-react";

const OrderHistoryPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [filter, setFilter] = useState("all"); // all, pending, completed, etc.

  // Fetch orders
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const res = await axios.get("http://localhost:4000/api/order/history", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setOrders(res.data.orders);
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Failed to load orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Format price
  const formatPrice = (price) => {
    return `LKR ${price?.toLocaleString() || 0}`;
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get status color and icon
  const getStatusInfo = (status) => {
    const statusMap = {
      pending: { color: "bg-yellow-100 text-yellow-800 border-yellow-200", icon: Clock, label: "Pending" },
      accepted: { color: "bg-blue-100 text-blue-800 border-blue-200", icon: CheckCircle, label: "Accepted" },
      preparing: { color: "bg-purple-100 text-purple-800 border-purple-200", icon: Package, label: "Preparing" },
      ready: { color: "bg-indigo-100 text-indigo-800 border-indigo-200", icon: CheckCircle, label: "Ready" },
      "picked-up": { color: "bg-cyan-100 text-cyan-800 border-cyan-200", icon: Truck, label: "Picked Up" },
      delivered: { color: "bg-green-100 text-green-800 border-green-200", icon: CheckCircle, label: "Delivered" },
      completed: { color: "bg-green-100 text-green-800 border-green-200", icon: CheckCircle, label: "Completed" },
      declined: { color: "bg-red-100 text-red-800 border-red-200", icon: XCircle, label: "Declined" },
    };
    return statusMap[status] || statusMap.pending;
  };

  // Get timeline step status
  const getTimelineStatus = (orderStatus, stepStatus) => {
    const statusOrder = ["pending", "accepted", "preparing", "ready", "picked-up", "delivered", "completed"];
    const orderIndex = statusOrder.indexOf(orderStatus);
    const stepIndex = statusOrder.indexOf(stepStatus);

    if (stepIndex < orderIndex) return "completed";
    if (stepIndex === orderIndex) return "current";
    return "pending";
  };

  // Timeline steps
  const timelineSteps = [
    { status: "pending", label: "Order Placed", icon: Clock },
    { status: "accepted", label: "Order Accepted", icon: CheckCircle },
    { status: "preparing", label: "Preparing", icon: Package },
    { status: "ready", label: "Ready for Pickup", icon: CheckCircle },
    { status: "picked-up", label: "Picked Up", icon: Truck },
    { status: "delivered", label: "Delivered", icon: CheckCircle },
  ];

  // Filter orders
  const filteredOrders = orders.filter(order => {
    if (filter === "all") return true;
    return order.status === filter;
  });

  // Toggle order expansion
  const toggleOrder = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            Order History
          </h1>
          <p className="text-gray-600 mt-2">Track and manage your orders</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg flex items-start">
            <XCircle className="text-red-500 mr-3 flex-shrink-0" size={20} />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-medium text-gray-700 mr-2">Filter by:</span>
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                filter === "all"
                  ? "bg-orange-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              All Orders
            </button>
            <button
              onClick={() => setFilter("pending")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                filter === "pending"
                  ? "bg-yellow-500 text-white"
                  : "bg-yellow-50 text-yellow-700 hover:bg-yellow-100"
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilter("accepted")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                filter === "accepted"
                  ? "bg-blue-500 text-white"
                  : "bg-blue-50 text-blue-700 hover:bg-blue-100"
              }`}
            >
              Accepted
            </button>
            <button
              onClick={() => setFilter("preparing")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                filter === "preparing"
                  ? "bg-purple-500 text-white"
                  : "bg-purple-50 text-purple-700 hover:bg-purple-100"
              }`}
            >
              Preparing
            </button>
            <button
              onClick={() => setFilter("delivered")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                filter === "delivered"
                  ? "bg-green-500 text-white"
                  : "bg-green-50 text-green-700 hover:bg-green-100"
              }`}
            >
              Delivered
            </button>
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <Package className="mx-auto text-gray-400 mb-4" size={64} />
            <h2 className="text-2xl font-bold text-gray-700 mb-2">No orders found</h2>
            <p className="text-gray-500 mb-6">
              {filter === "all" 
                ? "You haven't placed any orders yet." 
                : `No ${filter} orders found.`}
            </p>
            <button
              onClick={() => navigate("/")}
              className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-3 rounded-xl font-bold hover:from-orange-600 hover:to-orange-700 transition-all transform hover:scale-105 shadow-lg"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const StatusIcon = getStatusInfo(order.status).icon;
              const statusColor = getStatusInfo(order.status).color;
              const isExpanded = expandedOrder === order._id;

              return (
                <div
                  key={order._id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all hover:shadow-xl"
                >
                  {/* Order Header - Always Visible */}
                  <div
                    className="p-6 cursor-pointer"
                    onClick={() => toggleOrder(order._id)}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center space-x-4">
                        <div className="bg-orange-100 p-3 rounded-lg">
                          <ShoppingBag className="text-orange-600" size={24} />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Order #{order._id.slice(-8)}</p>
                          <div className="flex items-center mt-1">
                            <Calendar size={14} className="text-gray-400 mr-1" />
                            <p className="text-sm text-gray-600">{formatDate(order.createdAt)}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <div className={`px-3 py-1 rounded-full border ${statusColor} flex items-center`}>
                          <StatusIcon size={16} className="mr-1" />
                          <span className="text-sm font-medium">{getStatusInfo(order.status).label}</span>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">Total</p>
                          <p className="font-bold text-orange-600">{formatPrice(order.total)}</p>
                        </div>
                        {isExpanded ? (
                          <ChevronUp className="text-gray-400" size={20} />
                        ) : (
                          <ChevronDown className="text-gray-400" size={20} />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Order Details */}
                  {isExpanded && (
                    <div className="border-t border-gray-100">
                      {/* Order Timeline */}
                      <div className="p-6 bg-gray-50">
                        <h3 className="font-bold mb-4 flex items-center">
                          <Clock className="text-orange-600 mr-2" size={20} />
                          Order Timeline
                        </h3>
                        <div className="relative">
                          {/* Timeline Line */}
                          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-300"></div>
                          
                          {/* Timeline Steps */}
                          <div className="space-y-4">
                            {timelineSteps.map((step, index) => {
                              const stepStatus = getTimelineStatus(order.status, step.status);
                              const StepIcon = step.icon;
                              
                              return (
                                <div key={step.status} className="flex items-start relative">
                                  <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center
                                    ${stepStatus === "completed" ? "bg-green-500" :
                                      stepStatus === "current" ? "bg-orange-500" : "bg-gray-300"}`}
                                  >
                                    <StepIcon size={16} className="text-white" />
                                  </div>
                                  <div className="ml-4 flex-1">
                                    <p className={`font-medium ${
                                      stepStatus === "completed" ? "text-green-700" :
                                      stepStatus === "current" ? "text-orange-700" : "text-gray-500"
                                    }`}>
                                      {step.label}
                                    </p>
                                    {stepStatus === "current" && order.timeline?.find(t => t.status === step.status) && (
                                      <p className="text-sm text-gray-500">
                                        {new Date(order.timeline.find(t => t.status === step.status).at).toLocaleTimeString()}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      {/* Order Items by Shop with Images */}
                      <div className="p-6">
                        <h3 className="font-bold mb-4 flex items-center">
                          <Package className="text-orange-600 mr-2" size={20} />
                          Order Items
                        </h3>
                        
                        {/* Group items by shop */}
                        {Object.entries(
                          order.items.reduce((shops, item) => {
                            const shopId = item.shop?._id || 'unknown';
                            if (!shops[shopId]) {
                              shops[shopId] = {
                                name: item.shop?.name || order.shop?.name || 'Unknown Shop',
                                items: [],
                                subtotal: 0
                              };
                            }
                            shops[shopId].items.push(item);
                            shops[shopId].subtotal += item.price * item.quantity;
                            return shops;
                          }, {})
                        ).map(([shopId, shopData]) => (
                          <div key={shopId} className="mb-6 last:mb-0">
                            <div className="flex items-center mb-3 pb-2 border-b border-gray-200">
                              <Store size={18} className="text-orange-600 mr-2" />
                              <h4 className="font-semibold text-gray-800">{shopData.name}</h4>
                              <span className="ml-auto text-sm text-gray-500">{shopData.items.length} items</span>
                            </div>
                            
                            <div className="space-y-3">
                              {shopData.items.map((item, idx) => (
                                <div key={idx} className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg">
                                  {/* Item Image */}
                                  <div className="flex-shrink-0">
                                    {item.image ? (
                                      <img 
                                        src={item.image} 
                                        alt={item.name}
                                        className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                                        onError={(e) => {
                                          e.target.onerror = null;
                                          e.target.src = "https://via.placeholder.com/64?text=No+Image";
                                        }}
                                      />
                                    ) : (
                                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                                        <ImageIcon className="text-gray-400" size={24} />
                                      </div>
                                    )}
                                  </div>
                                  
                                  {/* Item Details */}
                                  <div className="flex-1">
                                    <p className="font-medium text-gray-800">{item.name}</p>
                                    <div className="flex items-center mt-1 text-sm text-gray-500">
                                      <span>Qty: {item.quantity}</span>
                                      <span className="mx-2">•</span>
                                      <span>Price: {formatPrice(item.price)}</span>
                                    </div>
                                  </div>
                                  
                                  {/* Item Total */}
                                  <div className="text-right">
                                    <p className="text-sm text-gray-500">Total</p>
                                    <p className="font-bold text-orange-600">{formatPrice(item.price * item.quantity)}</p>
                                  </div>
                                </div>
                              ))}
                              
                              {/* Shop Subtotal */}
                              <div className="flex justify-end pt-2 mt-2 border-t border-dashed border-gray-200">
                                <div className="text-right">
                                  <p className="text-sm text-gray-500">Shop Subtotal</p>
                                  <p className="font-bold text-orange-600 text-lg">{formatPrice(shopData.subtotal)}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Delivery Details */}
                      <div className="p-6 border-t border-gray-100">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-bold mb-2 flex items-center">
                              <MapPin size={16} className="text-gray-400 mr-2" />
                              Delivery Address
                            </h4>
                            <p className="text-gray-600 text-sm">{order.address}</p>
                          </div>
                          <div>
                            <h4 className="font-bold mb-2 flex items-center">
                              <Phone size={16} className="text-gray-400 mr-2" />
                              Contact Number
                            </h4>
                            <p className="text-gray-600 text-sm">{order.phone}</p>
                          </div>
                          <div>
                            <h4 className="font-bold mb-2 flex items-center">
                              <Truck size={16} className="text-gray-400 mr-2" />
                              Delivery Method
                            </h4>
                            <p className="text-gray-600 text-sm capitalize">{order.deliveryType} Delivery</p>
                          </div>
                          <div>
                            <h4 className="font-bold mb-2 flex items-center">
                              <CreditCard size={16} className="text-gray-400 mr-2" />
                              Payment Method
                            </h4>
                            <p className="text-gray-600 text-sm">Cash on Delivery</p>
                          </div>
                        </div>
                        
                        {order.instructions && (
                          <div className="mt-4">
                            <h4 className="font-bold mb-2 flex items-center">
                              <AlertCircle size={16} className="text-gray-400 mr-2" />
                              Special Instructions
                            </h4>
                            <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded-lg">
                              {order.instructions}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Order Summary */}
                      <div className="p-6 border-t border-gray-100 bg-gray-50">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm text-gray-500">Subtotal</p>
                            <p className="text-sm text-gray-500">Delivery Fee</p>
                            <p className="font-bold mt-2">Total</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm">{formatPrice(order.subtotal)}</p>
                            <p className="text-sm">{formatPrice(order.shippingFee)}</p>
                            <p className="font-bold text-orange-600 mt-2">{formatPrice(order.total)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Summary Stats */}
        {orders.length > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl shadow p-4">
              <p className="text-sm text-gray-500">Total Orders</p>
              <p className="text-2xl font-bold text-gray-800">{orders.length}</p>
            </div>
            <div className="bg-white rounded-xl shadow p-4">
              <p className="text-sm text-gray-500">Pending Orders</p>
              <p className="text-2xl font-bold text-yellow-600">
                {orders.filter(o => o.status === "pending").length}
              </p>
            </div>
            <div className="bg-white rounded-xl shadow p-4">
              <p className="text-sm text-gray-500">Delivered Orders</p>
              <p className="text-2xl font-bold text-green-600">
                {orders.filter(o => o.status === "delivered" || o.status === "completed").length}
              </p>
            </div>
            <div className="bg-white rounded-xl shadow p-4">
              <p className="text-sm text-gray-500">Total Spent</p>
              <p className="text-2xl font-bold text-orange-600">
                {formatPrice(orders.reduce((sum, o) => sum + o.total, 0))}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistoryPage;