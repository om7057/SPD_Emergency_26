import { User } from "../models/User.js";

export const createOrUpdateUser = async (req, res) => {
  try {
    const { clerkId, username, email, firstName, lastName, imageUrl } = req.body;
    console.log(`Upserting user: ${clerkId}`);

    const user = await User.findOneAndUpdate(
      { clerkId },
      { username, email, firstName, lastName, imageUrl },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    console.log("User saved:", user);
    res.status(200).json(user);
  } catch (error) {
    console.error("Error creating/updating user:", error);
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
};

export const getUserByClerkId = async (req, res) => {
  try {
    console.log(`Fetching user with Clerk ID: ${req.params.clerkId}`);

    const user = await User.findOne({ clerkId: req.params.clerkId })
      .populate("unlockedLevels")
      .populate("completedLevels")
      .populate("completedStories");

    if (!user) {
      console.warn("⚠️ User not found");
      return res.status(404).json({ error: "User not found" });
    }

    console.log("User found:", user);
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    console.log("Fetching all users...");
    const users = await User.find().sort({ createdAt: -1 });

    console.log(`✅ Found ${users.length} users`);
    res.status(200).json(users);
  } catch (error) {
    console.error("❌ Error fetching users:", error);
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
};

// ✅ UPDATE user by Clerk ID
export const updateUser = async (req, res) => {
  try {
    console.log(`📢 Updating user with Clerk ID: ${req.params.clerkId}`);
    
    const updatedUser = await User.findOneAndUpdate(
      { clerkId: req.params.clerkId },
      req.body,
      { new: true }
    );

    if (!updatedUser) {
      console.warn("⚠️ User not found for update");
      return res.status(404).json({ error: "User not found" });
    }

    console.log("✅ User updated:", updatedUser);
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("❌ Error updating user:", error);
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
};

// ✅ DELETE user by Clerk ID
export const deleteUser = async (req, res) => {
  try {
    console.log(`📢 Deleting user with Clerk ID: ${req.params.clerkId}`);

    const deletedUser = await User.findOneAndDelete({ clerkId: req.params.clerkId });

    if (!deletedUser) {
      console.warn("⚠️ User not found for deletion");
      return res.status(404).json({ error: "User not found" });
    }

    console.log("✅ User deleted:", deletedUser);
    res.status(200).json({ message: "User deleted successfully", deletedUser });
  } catch (error) {
    console.error("❌ Error deleting user:", error);
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
};

// ✅ READ: Get user progress by Clerk ID
export const getUserProgress = async (req, res) => {
  try {
    console.log(`📢 Fetching progress for Clerk ID: ${req.params.clerkId}`);

    const user = await User.findOne({ clerkId: req.params.clerkId })
      .populate("completedLevels")
      .populate("completedStories")
      .populate("unlockedLevels");

    if (!user) {
      console.warn("⚠️ User progress not found");
      return res.status(404).json({ error: "User progress not found" });
    }

    console.log("✅ User progress:", user);
    res.status(200).json(user);
  } catch (error) {
    console.error("❌ Error fetching user progress:", error);
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
};
