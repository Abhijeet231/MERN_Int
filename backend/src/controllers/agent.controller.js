import { Agent } from "../models/agent.model";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

//Create New Agent
export const createAgent = asyncHandler(async (req, res) => {
  const { name, email, mobile, password } = req.body;

  //Validating all required fields
  if (!name || !email || !mobile || !password) {
    throw new ApiError(400, "All fields required");
  }

  //Trim and lowercase for consistency
  const trimmedEmail = email.trim().toLowercase();
  const trimmedName = name.trim();
  const trimmedMobile = mobile.trim();

  //Check if agent already exists
  const existingAgent = await Agent.findOne({ email: trimmedEmail });
  if (existingAgent) {
    throw new ApiError(400, "Agent already exists");
  }

  //Creating new agent
  const newAgent = await Agent.create({
    name: trimmedName,
    email: trimmedEmail,
    mobile: trimmedMobile,
    password: password,
  });

  //Sending response with all agent info including password
  const agentData = {
    _id: newAgent._id,
    name: newAgent.name,
    email: newAgent.email,
    mobile: newAgent.mobile,
    password: newAgent.password,
  };

  //sending Success response
  return res
    .status(201)
    .json(new ApiResponse(201, agentData, "Agent created successfully"));
});

//Get all agents with their assigned tasks
export const getAllAgents = asyncHandler(async (req, res) => {
  // Fetch all agnets and populate their assigned tasks
  const agents = await Agent.find().populate("assignedTask");

  //Check if agents array is empty
  if (!agents || agents.length === 0) {
    throw new ApiError(404, "No agents Found");
  }

  //Response with agent info and assigned task count
  const agentDetailsWithTasks = agents.map((agent) => ({
    _id: agent._id,
    name: agent.name,
    email: agent.email,
    mobile: agent.mobile,
    password: agent.password,
    assignedTask: agent.assignedTask?.length || 0,
    assignedTask: agent.assignedTask,
  }));

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        agentDetailsWithTasks,
        "All Agents fetched successfully"
      )
    );
});
