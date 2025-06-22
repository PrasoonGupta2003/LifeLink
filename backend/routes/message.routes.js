import express from "express";
import protect from "../middlewares/auth.middleware.js";
import {
  sendMessage,
  getMessagesBetweenUsers,
  deleteChat,
} from "../controllers/message.controller.js";

const router = express.Router();

// POST /api/messages
router.post("/", protect, sendMessage);

// GET /api/messages/:otherUserId
router.get("/:otherUserId", protect, getMessagesBetweenUsers);

router.delete("/:otherUserId", protect, deleteChat);


export default router;
