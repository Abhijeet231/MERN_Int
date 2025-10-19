import multer from "multer";
import {ApiError} from "../utils/ApiError.js"


// Store file temporarily in memory
const storage = multer.memoryStorage();

//Multer instance with validation
export const upload = multer({
    storage, 
    fileFilter: (req,file,cb) => {
        //Allow only .csv files
        const allowedFileTypes = ["text/csv"];
        const isCSV = allowedFileTypes.includes(file.mimetype) || file.originalname.endsWith(".csv");

        if(!isCSV){
            return cb(new ApiError(400, "Only CSV files are allowed"), false);
        }
        cb(null, true);
    },
    limits: {
        fileSize: 5 * 1024 * 1024, // max 5mb
    },
});