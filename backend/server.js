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
    origin: "https://lifelink-1-kip8.onrender.com", // ✅ Frontend URL
    methods: ["GET", "POST", "PUT"],
    credentials: true,
  },
});

// Track connected users with multiple sockets
const userSocketMap = {}; // userId => Set(socketIds)

io.on("connection", (socket) => {
  console.log("🔌 Socket connected:", socket.id);

  // Join socket to user
  socket.on("join", (userId) => {
    if (!userSocketMap[userId]) {
      userSocketMap[userId] = new Set();
    }
    userSocketMap[userId].add(socket.id);
    console.log(`👤 User ${userId} joined with socket ${socket.id}`);
  });

  // Helper function to emit to all sockets of a user
  const emitToUser = (userId, message) => {
    const socketSet = userSocketMap[userId];
    if (socketSet) {
      socketSet.forEach((socketId) => {
        io.to(socketId).emit("newMessage", message);
      });
    }
  };

  // When message is sent
  socket.on("sendMessage", (message) => {
    emitToUser(message.to._id || message.to, message);
    emitToUser(message.from._id || message.from, message);
  });

  // On disconnect cleanup
  socket.on("disconnect", () => {
    console.log("❌ Socket disconnected:", socket.id);
    for (const [userId, socketSet] of Object.entries(userSocketMap)) {
      socketSet.delete(socket.id);
      if (socketSet.size === 0) {
        delete userSocketMap[userId];
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
    server.listen(PORT, () =>
      console.log(`🚀 Server running on port ${PORT}`)
    );
  })
  .catch((err) => {
    console.error("❌ DB connection error:", err);
  });

