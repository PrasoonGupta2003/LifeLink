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

    res.status(201).json(message);
  } catch (err) {
    console.error("Send Message Error:", err);
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
      .populate("from", "userName")
      .populate("to", "userName");

    res.json(messages);
  } catch (err) {
    console.error("Fetch Messages Error:", err);
    res.status(500).json({ msg: "Failed to fetch messages" });
  }
};

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
    console.error("Delete Chat Error:", err);
    res.status(500).json({ msg: "Failed to delete chat" });
  }
};
