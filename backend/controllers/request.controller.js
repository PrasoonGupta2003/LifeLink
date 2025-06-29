import Request from "../models/request.model.js";
import User from "../models/user.model.js";

// ✅ Create a new help request
export const createRequest = async (req, res) => {
  try {
    const request = await Request.create({
      ...req.body,
      createdBy: req.user._id,
    });
    res.status(201).json(request);
  } catch (err) {
    console.error("Create Request Error:", err);
    res.status(500).json({ msg: "Failed to create request" });
  }
};

// ✅ Get all open requests
export const getAllRequests = async (req, res) => {
  try {
    const requests = await Request.find({ status: "open" }).populate(
      "createdBy",
      "userName karma"
    );
    res.json(requests);
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch requests" });
  }
};

// ✅ Get my own requests
export const getMyRequests = async (req, res) => {
  try {
    const requests = await Request.find({ createdBy: req.user._id })
      .populate("matchedTo", "userName _id"); // ✅ FIXED field name here

    res.status(200).json(requests);
  } catch (err) {
    console.error("❌ Failed to get my requests:", err);
    res.status(500).json({ msg: "Server Error: Could not fetch your requests" });
  }
};



// ✅ Match a user to a request
export const matchRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);

    if (!request || request.status !== "open") {
      return res.status(400).json({ msg: "Request not open or not found" });
    }

    // ❌ Prevent user from matching to their own request
    if (String(request.createdBy) === String(req.user._id)) {
      return res.status(403).json({ msg: "You cannot match your own request" });
    }

    request.status = "matched";
    request.matchedTo = req.user._id;
    await request.save();

    res.json({ msg: "You’ve been matched to help!" });
  } catch (err) {
    console.error("Match Request Error:", err);
    res.status(500).json({ msg: "Failed to match request" });
  }
};

// ✅ Complete a matched request
export const completeRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);
    if (!request) return res.status(404).json({ msg: "Request not found" });

    // ✅ Only the requester can mark it completed
    if (String(request.createdBy) !== String(req.user._id)) {
      return res.status(403).json({ msg: "Only request owner can mark complete" });
    }

    // Check if it was matched and not already completed/cancelled
    if (request.status !== "matched") {
      return res.status(400).json({ msg: "Only matched requests can be completed" });
    }

    request.status = "completed";
    await request.save();

    // 🎁 Award karma to the helper
    await User.findByIdAndUpdate(request.matchedTo, { $inc: { karma: 10 } });

    res.json({ msg: "Request marked as completed. Helper earned 10 karma!" });
  } catch (err) {
    console.error("Complete request error:", err);
    res.status(500).json({ msg: "Failed to complete request" });
  }
};


// ✅ Get all requests user matched to
export const getMyMatches = async (req, res) => {
  try {
    const matched = await Request.find({ matchedTo: req.user._id }).populate(
      "createdBy",
      "userName"
    );
    res.json(matched);
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch matched requests" });
  }
};

// ✅ End (cancel) a request by its creator
export const endMyRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);

    if (!request) return res.status(404).json({ msg: "Request not found" });

    if (String(request.createdBy) !== String(req.user._id)) {
      return res.status(403).json({ msg: "Not authorized to end this request" });
    }

    if (request.status !== "open") {
      return res.status(400).json({ msg: "Only open requests can be ended" });
    }

    request.status = "cancelled";
    await request.save();

    res.json({ msg: "Request ended successfully" });
  } catch (err) {
    console.error("End Request Error:", err);
    res.status(500).json({ msg: "Failed to end request" });
  }
};

// In controllers/request.controller.js
export const deleteMyRequests = async (req, res) => {
  try {
    await Request.deleteMany({ createdBy: req.user._id });
    res.json({ msg: "All your requests have been deleted." });
  } catch (err) {
    console.error("Delete My Requests Error:", err);
    res.status(500).json({ msg: "Failed to delete requests" });
  }
};
