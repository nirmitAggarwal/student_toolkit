import User from "../models/User.js";
import mongoose from "mongoose";

export const getUserProfile = async (req, res) => {
  try {
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(req.user.id)) {
      return res
        .status(401)
        .json({ message: "Invalid session. Please log in again." });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ message: "Failed to fetch user profile" });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(req.user.id)) {
      return res
        .status(401)
        .json({ message: "Invalid session. Please log in again." });
    }

    const { name, college, branch, semester, rollNumber, theme } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        name: name || undefined,
        college: college || undefined,
        branch: branch || undefined,
        semester: semester || undefined,
        rollNumber: rollNumber || undefined,
        theme: theme || undefined,
      },
      { new: true, runValidators: true },
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Profile updated successfully", user });
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(400).json({ message: "Failed to update profile" });
  }
};

export const createUserIfNotExists = async (githubUser) => {
  try {
    console.log("GitHub user:", githubUser);

    let user = await User.findOne({
      githubId: githubUser.id.toString(),
    });

    console.log("Existing user:", user);

    if (!user) {
      console.log("Creating new user...");

      user = await User.create({
        githubId: githubUser.id.toString(),
        email: githubUser.email || `github_${githubUser.id}@example.com`,
        name: githubUser.name || githubUser.login,
        avatar: githubUser.avatar_url,
        bio: githubUser.bio,
      });

      console.log("Created:", user);
    }

    return user;
  } catch (err) {
    console.error(err);
    return null;
  }
};