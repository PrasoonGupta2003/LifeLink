import express from "express";
import {
  getLeaderboard,
  getMyProfile,
  updateProfile,
} from "../controllers/user.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

// 🔒 Protected routes
router.get("/me", authMiddleware, getMyProfile);
router.put("/me", authMiddleware, updateProfile);

// 🏅 Leaderboard (optional auth based on your use case)
router.get("/leaderboard", getLeaderboard);

export default router;
