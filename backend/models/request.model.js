import mongoose from "mongoose";

const requestSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["Free", "Paid", "Barter"],
      default: "Free",
    },
    tags: [String],
    location: String,
    neededBy: Date,
    status: {
      type: String,
      enum: ["open", "matched", "completed","cancelled"],
      default: "open",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    matchedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Request", requestSchema);
