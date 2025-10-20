import XLSX from "xlsx";
import { Agent } from "../models/agent.model.js";
import { DistList } from "../models/distList.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";



export const uploadAndDistribute = asyncHandler(async (req, res) => {
  //  Ensure a file is uploaded
  if (!req.file) {
    throw new ApiError(400, "No file uploaded");
  }

  // Validate file type
  const validExtensions = [".csv", ".xlsx", ".xls"];
  const ext = req.file.originalname
    .slice(req.file.originalname.lastIndexOf("."))
    .toLowerCase();

  if (!validExtensions.includes(ext)) {
    throw new ApiError(400, "Invalid file format. Only CSV, XLSX, and XLS are allowed.");
  }

  // Read and parse the file using SheetJS
  const mainFile = XLSX.read(req.file.buffer, { type: "buffer" });

  // Get the first worksheet
  const sheetName = mainFile.SheetNames[0];
  const sheet = mainFile.Sheets[sheetName];

  // Converting sheets to json
  const rows = XLSX.utils.sheet_to_json(sheet, {defval: ""});

  // Validate parsed data
  if (!rows.length) {
    throw new ApiError(400, "Uploaded file is empty or invalid format.");
  }

  // Normalize and clean data
  const cleanedData = rows
    .filter(row => row.firstName && row.phone) // Must have these fields
    .map(row => ({
      firstName: String(row.firstName).trim(),
      phone: String(row.phone).trim(),
      notes: row.notes ? String(row.notes).trim() : "",
    }));

  if (cleanedData.length === 0) {
    throw new ApiError(400, "No valid records found in uploaded file.");
  }

  //Fetch all agents from DB which are created by the current user
  const allAgents = await Agent.find({userId: req.user._id});
  if (allAgents.length === 0) {
    throw new ApiError(400, "No agents found to distribute lists.");
  }

  //Distribute records evenly among agents (round-robin)
  const totalAgents = allAgents.length;
  const distLists = cleanedData.map((row, index) => ({
    ...row,
    agentId: allAgents[index % totalAgents]._id,  // distribute among agents
    creatorId: req.user._id, // the user who uploaded 
  }));

  // Insert all records into DistList collection
  await DistList.insertMany(distLists);

  // Send success response
  return res.status(201).json(
    new ApiResponse(
      201,
      {
        totalRecords: distLists.length,
        agentsCount: totalAgents,
        recordPerAgent: Math.floor(distLists.length / totalAgents),
      },
      "File uploaded and distributed successfully"
    )
  );
});
