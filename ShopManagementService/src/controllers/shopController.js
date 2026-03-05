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
