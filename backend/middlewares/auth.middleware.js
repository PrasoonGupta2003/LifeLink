import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // ✅ Set userId for controller use
      req.userId = decoded.id;

      // Optional: attach full user if needed
      req.user = await User.findById(decoded.id).select("-password");

      next();
    } catch (err) {
      console.error("Auth middleware error:", err);
      return res.status(401).json({ msg: "Invalid token" });
    }
  } else {
    return res.status(401).json({ msg: "No token provided" });
  }
};

export default protect;

