import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import { Agent } from "../models/agent.model.js";
import { DistList } from "../models/distList.model.js";

// Function to generate AccessToken and RefreshToken
const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    console.log(error.message);
    throw new ApiError(
      500,
      "Error while generating RefreshToken and AccessToken"
    );
  }
};

// Register User
export const registerUser = asyncHandler(async (req, res) => {
  //Destructuring req.body
  const { name, email, password } = req.body;

  // Checking if user already exists
  const existedUser = await User.findOne({
    $or: [{ name }, { email }],
  });
  // If user exists , throw error
  if (existedUser) {
    throw new ApiError(400, "User Already Exists");
  }

  // Creating new user
  const user = await User.create({
    name,
    email,
    password,
  });

  //Fetching Created user without sensitive info
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  //If user creation failed
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while Creating new  user!");
  }
  //Returning success response
  return res
    .status(200)
    .json(
      new ApiResponse(200, { createdUser }, "User Registered Successfully")
    );
});

// Login User
export const loginUser = asyncHandler(async (req, res) => {
  //Destructuring req.body
  const { email, password } = req.body;
  //Finding user by email
  const user = await User.findOne({ email });
  // If user not found, throw error
  if (!user) {
    throw new ApiError(404, "Invalid Credentials");
  }

  //Comparing passwords
  const isPasswordCorrect = await user.isPasswordCorrect(password);
  //If password is incorrect, throw error
  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid Password");
  }
  //Generating accessToken and refreshToken
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );
  // Fetching loggedIn user without sensitive info
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  //Setting cookies options
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  };
  //Returning success response
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, { loggedInUser }, "User LoggedIn SuccessFully"));
});

// Logout User
export const logoutUser = asyncHandler(async (req, res) => {
  if (!req.user?._id) {
    throw new ApiError(401, "Unauthorized request");
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    { new: true }
  );

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User Logged out SUccessfully"));
});

// Get Current User with all data
export const getCurrentUser = asyncHandler(async (req, res) => {
  //Finding the user
  const currUser = await User.findById(req.user._id).populate({
    path: "agents",
    populate: {
      path: "assignedTask",
    },
  });
  //If user not found, throw error
  if (!currUser) {
    return res.status(404).json(new ApiResponse(404, null, "User not found"));
  }
  // Returning success response
  return res
    .status(200)
    .json(new ApiResponse(200, { currUser }, "Current user fetched"));
});

// Delete User with all realted information
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    throw new ApiError(404, "user not found");
  }

  // fetching  all related info and deleting them
  await Agent.deleteMany({ userId: user._id });
  await DistList.deleteMany({ creatorId: user._id });

  //Deleting the user
  const deletedUser = await User.findByIdAndDelete(user._id);

  //Clearing cookies
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "User Deleted Successfully"));
});

// Refresh Access Token (currently not in use)
export const refreshAccessToken = asyncHandler(async (req, res) => {
  //Getting refreshToken from cookies or request body
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;
  // If no refreshToken found, throw error
  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorised Request");
  }
  //Verifying incoming refreshToken
  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    // Finding user by decoded token id
    const user = await User.findById(decodedToken?._id);
    // if no user found
    if (!user) {
      throw new ApiError(401, "Invalid Refresh Token");
    }
    // Comparing incoming refreshToken with stored refreshToken
    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh Token is Expired or Used");
    }
    // Settign cookies options
    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    };
    // Generating new accessToken and refreshToken
    const { accessToken, refreshToken: newRefreshToken } =
      await generateAccessAndRefreshToken(user._id);

    // Returning success response
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access Token Refreshed Successfully"
        )
      );
  } catch (error) {
    console.log(error.message);
    throw new ApiError(401, error?.message || "Invalid RefreshToken");
  }
});
