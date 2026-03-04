import express from 'express';
import { checkoutOrder, getOrders,getRestaurantOrders,updateOrderStatus} from '../controllers/orderController.js';
import authUser from "../middleware/auth.js";
import restaurantAuth from '../middleware/restaurantAuth.js';
//import { authRider } from '../middleware/authRider.js';



const router = express.Router();

// Place a new order (checkout) - for users
router.post('/checkout', authUser, checkoutOrder);

//router.post("/stripe/checkout", authUser, stripeCheckout);

// Get order history for logged-in user
router.get('/history', authUser, getOrders);

router.get("/restaurant/orders", restaurantAuth, getRestaurantOrders);

router.patch('/:orderId/status', restaurantAuth, updateOrderStatus);

//router.post('/verify-stripe', authUser, verifyStripe);

// router.post("/assign-rider", restaurantAuth, assignRiderToOrder);

// router.get("/rider-assigned",authRider, getAssignedOrdersForRider);

// router.post('/rider/update-status', authRider, riderUpdateOrderStatus);







export default router;
