import mongoose from "mongoose";

const agentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Admin Id is required"],
    },
    name: {
      type: String,
      required: [true, "Agent name is required"],
      minlength: [2, "Name must be at least 2 characters long"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    mobile: {
      type: String,
      required: [true, "Mobile number with country code is required"],
      match: [
        /^\+\d{1,3}\s?\d{7,15}$/,
        "Please enter a valid mobile number with country code",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [5, "Password must be at least 5 characters long"],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual field to populate agent's assigned contacts
agentSchema.virtual("assignedTask", {
  ref: "DistList",
  localField: "_id",
  foreignField: "agentId",
});

export const Agent = mongoose.model("Agent", agentSchema);
