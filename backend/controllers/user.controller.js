import User from "../models/user.model.js";

// 🏅 Get Karma Leaderboard
export const getLeaderboard = async (req, res) => {
  try {
    const users = await User.find()
      .sort({ karma: -1 })
      .limit(20)
      .select("userName karma");

    res.json(users);
  } catch (err) {
    console.error("Leaderboard Error:", err);
    res.status(500).json({ msg: "Failed to fetch leaderboard" });
  }
};

// ✅ Get current user's profile
export const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) return res.status(404).json({ msg: "User not found" });

    res.json(user);
  } catch (err) {
    console.error("Get profile error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

// ✅ Update current user's profile
export const updateProfile = async (req, res) => {
  try {
    const { userName, bio, avatar, location } = req.body;

    const updated = await User.findByIdAndUpdate(
      req.userId,
      { userName, bio, location },
      { new: true, runValidators: true }
    ).select("-password");

    res.json(updated);
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ msg: "Failed to update profile" });
  }
};