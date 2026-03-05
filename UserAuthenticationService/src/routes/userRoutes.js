import express from 'express';
import { getUserById, getShops } from '../controllers/userController.js';

const router = express.Router();

// Route to get all shops
router.get('/shops', getShops);

// Route to get a specific user (used by other services like ShopManagementService)
router.get('/:id', getUserById);

export default router;
