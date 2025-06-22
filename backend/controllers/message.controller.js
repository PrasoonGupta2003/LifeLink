import Message from "../models/message.model.js";

// 📤 Send a message
export const sendMessage = async (req, res) => {
  try {
    const { to, content } = req.body;

    const message = await Message.create({
      from: req.user._id,
      to,
      content,
    });

    const fullMessage = await message
      .populate("from", "userName _id")
      .populate("to", "userName _id")
      .execPopulate?.(); // For Mongoose < 6

    // Mongoose v6+ auto-populates, so fallback to this if needed
    const populated = fullMessage || await Message.findById(message._id)
      .populate("from", "userName _id")
      .populate("to", "userName _id");

    res.status(201).json(populated);
  } catch (err) {
    console.error("❌ Send Message Error:", err);
    res.status(500).json({ msg: "Failed to send message" });
  }
};

// 📥 Get all messages between current user and other user
export const getMessagesBetweenUsers = async (req, res) => {
  try {
    const { otherUserId } = req.params;

    const messages = await Message.find({
      $or: [
        { from: req.user._id, to: otherUserId },
        { from: otherUserId, to: req.user._id },
      ],
    })
      .sort({ createdAt: 1 })
      .populate("from", "userName _id")
      .populate("to", "userName _id");

    res.json(messages);
  } catch (err) {
    console.error("❌ Fetch Messages Error:", err);
    res.status(500).json({ msg: "Failed to fetch messages" });
  }
};

// 🗑️ Delete chat between current user and other user
export const deleteChat = async (req, res) => {
  try {
    const { otherUserId } = req.params;

    await Message.deleteMany({
      $or: [
        { from: req.user._id, to: otherUserId },
        { from: otherUserId, to: req.user._id },
      ],
    });

    res.json({ msg: "Chat deleted successfully" });
  } catch (err) {
    console.error("❌ Delete Chat Error:", err);
    res.status(500).json({ msg: "Failed to delete chat" });
  }
};

