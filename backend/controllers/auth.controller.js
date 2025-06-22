import User from "../models/user.model.js";
import genToken from "../config/token.js";

// ✅ Signup Controller
export const signUp = async (req, res) => {
  try {
    const { userName, email, password } = req.body;

    const isUsernameExist = await User.findOne({ userName });
    if (isUsernameExist)
      return res.status(400).json({ msg: "Username already taken" });

    const user = await User.create({ userName, email, password });

    res.status(201).json({
      _id: user._id,
      userName: user.userName,
      email: user.email,
      karma: user.karma,
      token: genToken(user._id),
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ msg: "Signup failed" });
  }
};

// ✅ Login Controller
export const login = async (req, res) => {
  try {
    const { userName, password } = req.body;

    const user = await User.findOne({ userName });
    if (!user) return res.status(404).json({ msg: "User not found" });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(401).json({ msg: "Invalid credentials" });

    res.status(200).json({
      _id: user._id,
      userName: user.userName,
      email: user.email,
      karma: user.karma,
      token: genToken(user._id),
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ msg: "Login failed" });
  }
};
