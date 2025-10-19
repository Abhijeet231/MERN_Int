import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { createAgent, getAllAgents } from "../controllers/agent.controller.js";


const router = Router();

router.post('/',verifyJWT, createAgent); //Admin Creates agent
router.get('/',verifyJWT, getAllAgents); // Fetch all agents with assigned tasks

