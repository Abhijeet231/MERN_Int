import { Agent } from "../models/agent.model.js";
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
  const trimmedEmail = email.trim().toLowerCase();
  const trimmedName = name.trim();
  const trimmedMobile = mobile.trim();

  //Check if agent already exists
  const existingAgent = await Agent.findOne({ email: trimmedEmail });
  if (existingAgent) {
    throw new ApiError(400, "Agent already exists");
  }

  // Fetching logged-in user
  const currUserId = req.user._id;

  //Creating new agent
  const newAgent = await Agent.create({
    name: trimmedName,
    email: trimmedEmail,
    mobile: trimmedMobile,
    password,
    userId: currUserId,
  });

  //Sending response with all agent info including password
  const agentData = {
    _id: newAgent._id,
    name: newAgent.name,
    email: newAgent.email,
    mobile: newAgent.mobile,
    password: newAgent.password,
    userId: newAgent.userId,
  };

  //sending Success response
  return res
    .status(201)
    .json(new ApiResponse(201, { agentData }, "Agent created successfully"));
});

//Get all agents with their assigned tasks FOR FEATURE
export const getAllAgents = asyncHandler(async (req, res) => {
  // Fetch all agents and populate their assigned tasks
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
    taskCount: agent.assignedTask?.length || 0,
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

// Get single agent with all details
export const getSingleAgent = asyncHandler(async (req, res) => {
  const { id } = req.params;

  //Fetch the specific agent with agent id
  const agent = await Agent.findById(id).populate("assignedTask");

  //Check if agent exists
  if (!agent) {
    throw new ApiError(404, "Agent not Found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, { agent }, "Agent Fetched successfully"));
});
