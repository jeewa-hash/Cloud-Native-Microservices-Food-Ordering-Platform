import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  Package,
  ChevronDown,
  ChevronUp,
  User,
  MapPin,
  Phone,
  CreditCard,
  ShoppingBag,
  Store,
  Info,
  Search,
} from "lucide-react";

const ShopOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) return;
      const res = await axios.get("http://localhost:4040/api/shops/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        let loaded = res.data.orders || [];
        // if any order doesn't have a userName but has a user id string, try fetching from auth service
        const authUrl = "http://localhost:5002"; // make sure this matches .env for auth service
        const toEnrich = loaded.filter(o => !o.userName && o.user && typeof o.user === "string");
        if (toEnrich.length > 0) {
          await Promise.all(
            toEnrich.map(async (o) => {
              try {
                const r = await axios.get(`${authUrl}/api/users/${o.user}`);
                if (r.data && r.data.name) {
                  o.userName = r.data.name;
                }
              } catch (e) {
                console.error("Failed to fetch user name for order", o._id, e.message);
              }
              return o;
            })
          );
        }
        setOrders(loaded);
      } else {
        setError(res.data.message || "Failed to load orders");
      }
    } catch (err) {
      console.error("Error fetching shop orders:", err);
      setError("Failed to load orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const formatPrice = (price) => `LKR ${(price ?? 0).toLocaleString()}`;

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

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

  const getPaymentStatusColor = (ps) => {
    if (ps === "paid") return "text-green-600 bg-green-50 border-green-200";
    if (ps === "failed") return "text-red-600 bg-red-50 border-red-200";
    return "text-yellow-600 bg-yellow-50 border-yellow-200";
  };

  const timelineSteps = [
    { status: "pending", label: "Order Placed", icon: Clock },
    { status: "accepted", label: "Order Accepted", icon: CheckCircle },
    { status: "preparing", label: "Preparing", icon: Package },
    { status: "ready", label: "Ready for Pickup", icon: CheckCircle },
    { status: "picked-up", label: "Picked Up", icon: Truck },
    { status: "delivered", label: "Delivered", icon: CheckCircle },
  ];

  const statusOrder = ["pending", "accepted", "preparing", "ready", "picked-up", "delivered", "completed"];

  const getTimelineStatus = (orderStatus, stepStatus) => {
    const orderIndex = statusOrder.indexOf(orderStatus);
    const stepIndex = statusOrder.indexOf(stepStatus);
    if (stepIndex < orderIndex) return "completed";
    if (stepIndex === orderIndex) return "current";
    return "pending";
  };

  const toggleOrder = (orderId) =>
    setExpandedOrder(expandedOrder === orderId ? null : orderId);

  const handleStatusChange = async (orderId, newStatus) => {
    setStatusUpdating(true);
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `http://localhost:4040/api/shops/orders/${orderId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchOrders();
    } catch (err) {
      console.error("Error updating order status:", err);
      alert("Failed to update status");
    } finally {
      setStatusUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="w-8 h-8 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-6 rounded-2xl flex flex-col items-center justify-center text-center shadow-sm">
        <p className="font-medium mb-4">{error}</p>
      </div>
    );
  }

  const filteredOrders = orders.filter((order) => {
    let matchesSearch = true;
    if (searchQuery.trim() !== "") {
      matchesSearch = order._id.toLowerCase().includes(searchQuery.toLowerCase().trim());
    }

    let matchesDate = true;
    if (startDate || endDate) {
      const orderDate = new Date(order.createdAt);
      if (startDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        if (orderDate < start) matchesDate = false;
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        if (orderDate > end) matchesDate = false;
      }
    }

    return matchesSearch && matchesDate;
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Orders For You</h2>
        <p className="text-gray-500 mt-1">View and manage incoming orders.</p>
      </div>

      {/* ── Filters ── */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col lg:flex-row gap-4 items-center justify-between">
        <div className="relative w-full lg:w-1/2">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="text-gray-400 w-5 h-5" />
          </div>
          <input
            type="text"
            placeholder="Search by Order ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 bg-gray-50 hover:bg-white focus:bg-white transition-colors"
          />
        </div>

        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full lg:w-auto">
          <div className="flex flex-col flex-1 sm:flex-none">
            <label className="text-xs text-gray-500 font-medium mb-1">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm text-gray-700 w-full"
            />
          </div>
          <span className="text-gray-400 mt-5 hidden sm:block">-</span>
          <div className="flex flex-col flex-1 sm:flex-none">
            <label className="text-xs text-gray-500 font-medium mb-1">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm text-gray-700 w-full"
            />
          </div>
          {(startDate || endDate || searchQuery) && (
            <div className="flex flex-col justify-end mt-5 sm:mt-0 ml-auto sm:ml-2">
              <button
                onClick={() => { setStartDate(""); setEndDate(""); setSearchQuery(""); }}
                className="text-sm text-orange-600 hover:text-orange-700 font-medium px-2 py-2"
              >
                Clear
              </button>
            </div>
          )}
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-gray-100 flex flex-col items-center justify-center text-center shadow-sm">
          <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mb-4">
            <Package className="w-8 h-8 text-orange-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No orders yet</h3>
          <p className="text-gray-500 max-w-sm">You haven't received any orders from customers yet.</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-gray-100 flex flex-col items-center justify-center text-center shadow-sm">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No matching orders found</h3>
          <p className="text-gray-500 max-w-sm">Try adjusting your filters or search query.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const statusInfo = getStatusInfo(order.status);
            const isExpanded = expandedOrder === order._id;

            return (
              <div key={order._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {/* ── Order Header ── */}
                <div className="p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center flex-shrink-0">
                      <Package className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">
                        #{order._id?.slice(-8).toUpperCase()}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">{formatDate(order.createdAt)}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {order.userName || order.user?.name || order.user || "Customer"}
                      </p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusInfo.color}`}>
                    {statusInfo.label}
                  </span>
                </div>

                {/* ── Toggle Button ── */}
                <div className="px-6 pb-4">
                  <button
                    onClick={() => toggleOrder(order._id)}
                    className="flex items-center gap-1 text-sm font-medium text-orange-600 hover:text-orange-700 transition-colors"
                  >
                    {isExpanded ? "Hide Details" : "View Details"}
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>

                {/* ── Expanded Details ── */}
                {isExpanded && (
                  <div className="border-t border-gray-100 px-6 py-6 space-y-6">

                    {/* ── Info Grid: Customer / Shop / Delivery ── */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Customer */}
                      <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide flex items-center gap-1">
                          <User className="w-3.5 h-3.5" /> Customer
                        </p>
                        <p className="text-sm text-gray-800 font-medium">
                          {order.userName || order.user?.name || order.user || "—"}
                        </p>
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5 text-gray-400" />
                          {order.phone || "—"}
                        </p>
                        <p className="text-sm text-gray-600 flex items-start gap-1">
                          <MapPin className="w-3.5 h-3.5 text-gray-400 mt-0.5 flex-shrink-0" />
                          {order.address || "—"}
                        </p>
                      </div>

                      {/* Shop */}
                      <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide flex items-center gap-1">
                          <Store className="w-3.5 h-3.5" /> Shop
                        </p>
                        <p className="text-sm text-gray-800 font-medium">{order.shop?.name || "—"}</p>
                        <p className="text-xs text-gray-400">ID: {order.shop?._id?.toString()?.slice(-8) || "—"}</p>
                      </div>

                      {/* Delivery */}
                      <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide flex items-center gap-1">
                          <Truck className="w-3.5 h-3.5" /> Delivery
                        </p>
                        <p className="text-sm text-gray-800 font-medium capitalize">
                          {order.deliveryType || "—"}
                        </p>
                        {order.instructions && (
                          <p className="text-xs text-gray-500 flex items-start gap-1">
                            <Info className="w-3 h-3 text-gray-400 mt-0.5 flex-shrink-0" />
                            {order.instructions}
                          </p>
                        )}
                        <p className="text-xs text-gray-500">
                          Created: {formatDate(order.createdAt)}
                        </p>
                      </div>
                    </div>

                    {/* ── Payment ── */}
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide flex items-center gap-1 mb-3">
                        <CreditCard className="w-3.5 h-3.5" /> Payment
                      </p>
                      <div className="flex flex-wrap gap-3">
                        <div>
                          <p className="text-xs text-gray-400">Method</p>
                          <p className="text-sm font-medium text-gray-800 uppercase">{order.paymentMethod || "—"}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Status</p>
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border capitalize ${getPaymentStatusColor(order.paymentStatus)}`}>
                            {order.paymentStatus || "pending"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* ── Items ── */}
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide flex items-center gap-1 mb-3">
                        <ShoppingBag className="w-3.5 h-3.5" /> Items
                      </p>
                      <div className="bg-gray-50 rounded-xl overflow-hidden">
                        {order.items?.map((item, idx) => (
                          <div
                            key={item._id || idx}
                            className="flex items-center justify-between px-4 py-3 border-b border-gray-100 last:border-0"
                          >
                            <div className="flex items-center gap-3">
                              {item.image ? (
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-lg bg-gray-200 flex items-center justify-center flex-shrink-0">
                                  <Package className="w-4 h-4 text-gray-400" />
                                </div>
                              )}
                              <div>
                                <p className="text-sm font-medium text-gray-800">{item.name}</p>
                                <p className="text-xs text-gray-400">x {item.quantity} · {formatPrice(item.price)} each</p>
                              </div>
                            </div>
                            <p className="text-sm font-semibold text-gray-900">
                              {formatPrice((item.price ?? 0) * (item.quantity ?? 1))}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* ── Price Summary ── */}
                    <div className="bg-orange-50 rounded-xl p-4 space-y-2">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Price Summary</p>
                      <div className="flex justify-between text-sm text-gray-700">
                        <span>Subtotal</span>
                        <span>{formatPrice(order.subtotal)}</span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-700">
                        <span>Shipping Fee</span>
                        <span>{formatPrice(order.shippingFee)}</span>
                      </div>
                      <div className="flex justify-between font-bold text-gray-900 pt-2 border-t border-orange-200">
                        <span>Total</span>
                        <span className="text-orange-600">{formatPrice(order.total)}</span>
                      </div>
                    </div>

                    {/* ── Change Status ── */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                        Change Status
                      </label>
                      <select
                        disabled={statusUpdating}
                        value={order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className="w-full pl-3 pr-10 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent bg-white"
                      >
                        <option value="pending">Pending</option>
                        <option value="accepted">Accepted</option>
                        <option value="preparing">Preparing</option>
                        <option value="ready">Ready</option>
                        <option value="picked-up">Picked Up</option>
                        <option value="delivered">Delivered</option>
                        <option value="completed">Completed</option>
                        <option value="declined">Declined</option>
                      </select>
                    </div>

                    {/* ── Timeline ── */}
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">Timeline</p>
                      <div className="relative">
                        {/* Vertical connector line */}
                        <div className="absolute left-5 top-5 bottom-5 w-0.5 bg-gray-200" />
                        <div className="space-y-4">
                          {timelineSteps.map((step) => {
                            const stepState = getTimelineStatus(order.status, step.status);
                            const Icon = step.icon;
                            // find matching timeline entry for timestamp
                            const timelineEntry = order.timeline?.find(t => t.status === step.status);
                            return (
                              <div key={step.status} className="flex items-start gap-4 relative">
                                <div
                                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 z-10 flex-shrink-0 transition-all ${stepState === "completed"
                                    ? "border-green-500 bg-green-500 text-white"
                                    : stepState === "current"
                                      ? "border-orange-500 bg-white text-orange-500 shadow-md shadow-orange-100"
                                      : "border-gray-200 bg-white text-gray-300"
                                    }`}
                                >
                                  <Icon className="w-5 h-5" />
                                </div>
                                <div className="pt-1.5">
                                  <p className={`text-sm font-semibold ${stepState === "completed" ? "text-green-700" :
                                    stepState === "current" ? "text-orange-600" : "text-gray-400"
                                    }`}>
                                    {step.label}
                                  </p>
                                  {timelineEntry?.at && (
                                    <p className="text-xs text-gray-400 mt-0.5">
                                      {formatDate(timelineEntry.at)}
                                    </p>
                                  )}
                                </div>
                              </div>
                            );
                          })}
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
    </div>
  );
};

export default ShopOrders;
