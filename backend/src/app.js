import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { ApiError } from "./utils/ApiError.js";

// Express App Initialization
const app = express();

// Cors configuration
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}));

//Middlewares Configurations
app.use(express.json({limit: "4mb"}));
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(cookieParser());


//User routes
import userRouter from "./routes/user.router.js";
app.use("/api/v1/users", userRouter);

// Agent routes
import agentRouter from "./routes/agent.router.js";
app.use("/api/v1/agents", agentRouter);

//DistList routes
import distListRouter from "./routes/distList.router.js";
app.use("/api/v1/distlist", distListRouter);

// Global Error handler
app.use((err,req,res,next) => {
    console.log(err);

    //Checking if it's an ApiErrror
    if(err instanceof ApiError){
        return res.status(err.statusCode).json({
            status: err.statusCode,
            success: false,
            message: err.message,
            errors: err.errors || [],
        });
    }

    // For unexpected errors
    return res.status(500).json({
        status: 500,
        success: false,
        message: err.message || "internal server errror",
    });

    
});


export default app;