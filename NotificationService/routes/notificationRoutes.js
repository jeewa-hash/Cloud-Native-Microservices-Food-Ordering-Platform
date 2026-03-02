import express from "express";
import { getUserNotifications } from "../controllers/notificationController.js";

const router = express.Router();

router.get("/:recipientId", getUserNotifications);

export default router;