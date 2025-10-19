import multer from "multer";
import {ApiError} from "../utils/ApiError.js"
import path from "path";


const storage = multer.diskStorage({
    destination: (req,res,cb) => cb(null, "upload/"),
    filename: (req,file,cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random()*1e9);
        cb(null, file.filename + "-" + uniqueSuffix + path.extname(file.originalname))
    }
});

export const upload = multer({storage});