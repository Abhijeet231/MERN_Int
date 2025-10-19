import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// Express App Initialization
const app = express();

// Cors configuration
app.use(cors({
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
import agentRouter from "./routes/agent.router.js"
app.use("/api/v1/agents", agentRouter);

export default app;