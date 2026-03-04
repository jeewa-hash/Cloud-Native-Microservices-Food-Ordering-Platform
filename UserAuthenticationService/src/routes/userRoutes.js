import express from 'express';
import { getUserById } from '../controllers/userController.js';

const router = express.Router();

// Route to get a specific user (used by other services like ShopManagementService)
router.get('/:id', getUserById);

export default router;
