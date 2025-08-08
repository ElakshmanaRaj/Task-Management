const Task = require("../models/Task");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

// Get All Users (Admin Only)
// GET method
const getUsers = async (req, res) => {
    try {
        const users = await User.find({role:"member"}).select("-password");

        const userWithTaskCounts = await Promise.all(users.map(async (user) => {
            const pendingTasks = await Task.countDocuments({assignedTo:user._id, status:"Pending"});
            const inProgressTasks = await Task.countDocuments({assignedTo:user._id, status:"In Progress"});
            const completedTasks = await Task.countDocuments({assignedTo:user._id, status:"Completed"});

            return {
                ...user._doc,
                pendingTasks,
                inProgressTasks,
                completedTasks
            };
        }));

        res.json(userWithTaskCounts);

    } catch (error) {
        res.status(500).json({message: "Server Eroor", error: error.message});
    }
}

// Get User By Id
const getUserById = async (req, res) => {
    try {
        
        const user = await User.findById(req.params.id).select("-password");
        if(!user) return res.status(404).json({message:"User not found"});
        res.json(user);

    } catch (error) {
        res.status(500).json({message:"Server Error", error: error.message});
    }
}

const deleteUser = async (req, res) => {
    try {
        
    } catch (error) {
        res.status(500).json({message:"Server Error", error: error.message});
    }
}

module.exports = {getUsers, getUserById, deleteUser};