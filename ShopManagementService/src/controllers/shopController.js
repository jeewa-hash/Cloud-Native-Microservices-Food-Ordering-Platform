import axios from "axios";

// @desc    Get all shops
// @route   GET /api/shops
// @access  Public
export const getAllShops = async (req, res) => {
    try {
        // Fetch shops from UserAuthenticationService
        const authResponse = await axios.get(`${process.env.AUTH_SERVICE_URL}/api/users/shops`);
        res.status(200).json(authResponse.data);
    } catch (error) {
        console.error("Error fetching shops from Auth Service:", error.message);
        res.status(500).json({ message: "Failed to fetch shops" });
    }
};

// ----------------------------------------------------
// SHOP ORDER PROXY
// ----------------------------------------------------

// @desc   Get orders belonging to the authenticated shop
// @route  GET /api/shops/orders
// @access Shop only (protected)
export const getShopOrders = async (req, res) => {
  try {
    const token = req.headers.authorization;
    const response = await axios.get(`${process.env.ORDER_SERVICE_URL}/api/order/shop`, {
      headers: { Authorization: token }
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Error proxying shop orders to Order service:", error.message);
    const status = error.response?.status || 500;
    const data = error.response?.data || { message: "Failed to fetch shop orders" };
    res.status(status).json(data);
  }
};

// @desc   Update an order status (shop owner)
// @route  PATCH /api/shops/orders/:orderId/status
// @access Shop only (protected)
export const updateOrderStatus = async (req, res) => {
  try {
    const token = req.headers.authorization;
    const { orderId } = req.params;
    const { status } = req.body;
    const response = await axios.patch(
      `${process.env.ORDER_SERVICE_URL}/api/order/shop/${orderId}/status`,
      { status },
      { headers: { Authorization: token } }
    );
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Error proxying order status update to Order service:", error.message);
    const statusCode = error.response?.status || 500;
    const data = error.response?.data || { message: "Failed to update order status" };
    res.status(statusCode).json(data);
  }
};
