import mongoose from "mongoose";

const distListSchema = new mongoose.Schema({
  agentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Agent",
    required: true,
  },
  creatorId: {
   type: mongoose.Schema.Types.ObjectId,
   ref: "User",
   required: true,
  },
  firstName: {
    type: String,
    required: [true, "First name is required"],
  },
  phone: {
    type: Number,
    required: [true, "Phone number is required"],
    validate: {
      validator: function (v) {
        return /^[0-9]{7,15}$/.test(v.toString());
      },
      message: "Please enter a valid phone number",
    },
  },
  notes: {
    type: String,
    default: "",
  },
});

export const DistList = mongoose.model("DistList", distListSchema);
