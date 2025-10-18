import mongoose from "mongoose";
import {DB_NAME} from "../constants.js";

// Function to connect to MongoDB
export const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(
            `${process.env.MONGODB_URL}/${DB_NAME}`
        )
    } catch (error) {
        console.log('MONGODB CONNECTION ERROR', error.message);
        process.exit(1);
        
    }
};
