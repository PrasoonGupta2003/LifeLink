import express from "express";
import { signUp, login } from "../controllers/auth.controller.js";

const router = express.Router();

// POST /api/auth/signup
router.post("/signup", signUp);

// POST /api/auth/login
router.post("/login", login);

export default router;
