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


export default app;