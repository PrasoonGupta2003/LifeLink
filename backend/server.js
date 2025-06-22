import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import http from "http";
import { Server } from "socket.io";

// Load env variables
dotenv.config();

const app = express();
const server = http.createServer(app); // For socket.io

const io = new Server(server, {
  cors: {
    origin: "*", // Change to your frontend URL in production
    methods: ["GET", "POST", "PUT"],
  },
});

// Socket.io ha
// handling
io.on("connection", (socket) => {
  console.log("🔌 Socket connected:", socket.id);

  socket.on("join", (userId) => {
    socket.join(userId);
  });

  socket.on("sendMessage", ({ to, message }) => {
    io.to(to).emit("receiveMessage", message);
  });

  socket.on("disconnect", () => {
    console.log("❌ Socket disconnected");
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

// DB Connection
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
