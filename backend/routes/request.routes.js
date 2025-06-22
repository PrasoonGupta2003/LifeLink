import express from "express";
import protect from "../middlewares/auth.middleware.js";
import { endMyRequest, deleteMyRequests } from "../controllers/request.controller.js";
import {
  createRequest,
  getAllRequests,
  getMyRequests,
  matchRequest,
  completeRequest,
  getMyMatches,
} from "../controllers/request.controller.js";

const router = express.Router();

// POST /api/requests/create
router.post("/create", protect, createRequest);

// GET /api/requests/all
router.get("/all", protect, getAllRequests);

// GET /api/requests/mine
router.get("/mine", protect, getMyRequests);

// PUT /api/requests/match/:id
router.put("/match/:id", protect, matchRequest);

// PUT /api/requests/complete/:id
router.put("/complete/:id", protect, completeRequest);

// GET /api/requests/matched-to-me
router.get("/matched-to-me", protect, getMyMatches);

router.put("/end/:id", protect, endMyRequest);

// In routes/request.routes.js
router.delete("/mine", protect, deleteMyRequests);


export default router;
