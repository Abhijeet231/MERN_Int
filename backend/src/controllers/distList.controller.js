import csv from "csv-parser";
import { Agent } from "../models/agent.model.js";
import { DistList } from "../models/distList.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";



//Node's stream utility
import { Readable } from "stream";


export const uploadAndDistribute = asyncHandler ( async(req,res) => {
    
    // Check if file is uploaded 
    if(!req.file) {
        throw new ApiError(400, "No Csv file uploaded");
    }

    const results = [];

    //Convert buffer to redable stream and parse csv
    const redable = Readable.from(req.file.buffer);

    await new Promise((resolve,reject) => {
        redable
        .pipe(csv())
        .on("data", (row) => {
            //validate basic structure
            if(!row.firstName || !row.phone) return;

            results.push({
                firstName: row.firstName.trim(),
                phone: row.phone.trim(),
                notes: row.notes? row.notes.trim() : "",
            });

        })
        .on("end", resolve)
        .on("error", reject);
    });

    //Validate parsed data
    if(results.length === 0) {
        throw new ApiError(400, "CSV is empty or invalid format");
    }

    //Fetch all agents
    const allAgents = await Agent.find();
    if(allAgents.length === 0) {
        throw new ApiError(400, "No agents found to distribute lists");
    }

    //Distribut tasks among agents
    const totalAgents = allAgents.length;
    const distLists = [];

    results.forEach((row, index) => {
        const agentIndex = index % totalAgents; 
        distLists.push({
            ...row,
            agentId: allAgents[agentIndex]._id, //assigning agent Id before saving 
        });
    });

    // Save all distributed records
    await DistList.insertMany(distLists);

    //Send success response
    res.status(201).json(new ApiResponse(201, 
        {
            totalRecords: distLists.length,
            agentsCount: totalAgents,
            recordPerAgent: Math.floor(distLists.length / totalAgents),
        },
        "Csv uploaded and distributed successfully"
     ))


} );
