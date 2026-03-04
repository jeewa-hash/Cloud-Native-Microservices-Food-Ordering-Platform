import User from '../models/User.js';

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Public (or protected depending on requirements, kept public for inter-service calls)
export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            id: user._id,
            username: user.userName,
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
            role: user.role,
            phone: user.phone
        });
    } catch (error) {
        console.error("Get User Error:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
