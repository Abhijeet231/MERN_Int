import {Router} from "express";
import { registerUser, loginUser, getCurrentUser, refreshAccessToken, logoutUser, deleteUser  } from "../controllers/user.controller.js";
import {verifyJWT} from "../middleware/auth.middleware.js";

const router = Router();

//Register a new user 
router.post("/register", registerUser);

//Login user
router.post("/login", loginUser);

//Logout User
router.post("/logout", verifyJWT, logoutUser);

//Get user details
router.get("/me", verifyJWT, getCurrentUser);

// Delete User
router.delete("/me", verifyJWT, deleteUser)

//Refresh token
router.post("/refresh", refreshAccessToken);

export default router;