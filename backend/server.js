import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import http from "http";
import { Server } from "socket.io";

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);

// Setup socket.io
const io = new Server(server, {
  cors: {
    origin: "https://lifelink-1-kip8.onrender.com", // ✅ Your frontend URL
    methods: ["GET", "POST", "PUT"],
    credentials: true,
  },
});

// Track connected users
const userSocketMap = {}; // userId => socketId

io.on("connection", (socket) => {
  console.log("🔌 Socket connected:", socket.id);

  // When a user joins with their ID
  socket.on("join", (userId) => {
    userSocketMap[userId] = socket.id;
    console.log(`👤 User ${userId} joined with socket ${socket.id}`);
  });

  // Send message from one user to another
  socket.on("sendMessage", (message) => {
    const receiverSocketId = userSocketMap[message.to];
    const senderSocketId = userSocketMap[message.from];

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", message);
    }

    // Optional: emit to sender as well to ensure UI sync
    if (senderSocketId) {
      io.to(senderSocketId).emit("newMessage", message);
    }
  });

  // Cleanup on disconnect
  socket.on("disconnect", () => {
    console.log("❌ Socket disconnected:", socket.id);
    for (const [userId, sockId] of Object.entries(userSocketMap)) {
      if (sockId === socket.id) {
        delete userSocketMap[userId];
        break;
      }
    }
  });
});

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
import authRoutes from "./routes/auth.routes.js";
import requestRoutes from "./routes/request.routes.js";
import userRoutes from "./routes/user.routes.js";
import messageRoutes from "./routes/message.routes.js";

app.use("/api/auth", authRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);

// MongoDB connection and server startup
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("❌ DB connection error:", err);
  });

