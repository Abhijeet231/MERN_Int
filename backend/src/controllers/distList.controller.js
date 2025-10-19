import fs from "fs";
import papa from "papaparse";
import { Agent } from "../models/agent.model";
import { DistList } from "../models/distList.model";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";

//Upload CSV file and distribut entries among agents
export const uploadAndDistributeList = async (req,res) => {
    try {
        //Ensure file exists
        if(!req.file){
            throw new ApiError(400, "Please upload a CSV file ")
        };

        // Validate file extension
        const allowedExt = [".csv"];
        const fileExt = req.file.originalname.slice(req.file.originalname.lastIndexOf(".")).toLowercase();

        if(!allowedExt.includes(fileExt)) {
            fs.unlinkSync(req.file.path); // delete invalid file
            throw new ApiError(400, "Only CSV file are allowed");
        }

        //Read and parse csv
        const fileContent = fs.readFileSync(req.file.path, "utf-8");
        const parsed = papa.parse(fileContent, {header: true, skipEmptyLines: true});

        //Handle parsing errors
        if(parsed.errors.length > 0) {
            fs.unlinkSync(req.file.path);
            throw new ApiError(400, "Error parsing CSV file ")
        };

        const data = parsed.data;
        if(!data.length) {
            fs.unlinkSync(req.file.path);
            return res.status(400).json({message: "CSV file is empty"});
        }

        //Validate required fields
        const invalidRows = data.filter(
            (row) => !row.firstName || !row.phone || row.phone.toString().trim() === ""
        );

        if(invalidRows.length > 0) {
            fs.unlinkSync(req.file.path);
            throw new ApiError(400, "Some rows have missign required fields")
        }

        //Fetch all agetns
        const agents = await Agent.find();
        if(agents.length === 0){
            fs.unlinkSync(req.file.path);
            throw new ApiError(400, "No Agents Found. Please Create agents")
        };

        // Distribute tasks equally among agents
        const distributedRecords = data.map((record,index) => {
            const agentIdx = index % agents.length;
            return {
                agentId: agents[agentIdx]._id,
                firstName: record.FirstName.trim(),
                phone: record.phone.trim(),
                notes: record.notes ? record.notes.trim() : "",
            }
        });

        //Insert into MongoDB
        await DistList.insertMany(distributedRecords);

        //CleanUp uploaded file
        fs.unlinkSync(req.file.path);

        //Respons
        return res.status(200).json(new ApiResponse(200, 
            {totalTasks: distributedRecords.length, totalAgents: agents.length}, "CSV uploaded and distributed successfully"
        ))


    } catch (error) {
        console.log("ERROR In UploadAndDistribute Tasks:", error.message);
        throw new ApiError(500, "Error while uploading and Distributing list")
        
    }
}