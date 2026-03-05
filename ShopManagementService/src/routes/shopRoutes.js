import express from "express";
import { getAllShops } from "../controllers/shopController.js";

const router = express.Router();

router.get("/", getAllShops);

export default router;
