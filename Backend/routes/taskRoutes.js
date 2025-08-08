const express = require("express");
const { protect, adminOnly } = require("../middlewares/authMiddleware");
const { createTask, deleteTask, getDashboardData, getUserDashboardData, getTasks, getTaskById, updateTask, updateTaskStatus, updateTaskChecklist } = require("../controllers/taskController");


const router = express.Router();

// Task Management Routes
router.get("/dashboard-data", protect, getDashboardData );
router.get("/user-dashboard-data", protect, getUserDashboardData );
router.get("/", protect, getTasks);
router.get("/:id", protect, getTaskById);
router.post("/", protect, adminOnly, createTask);
router.put("/:id", protect, updateTask);
router.delete("/:id", protect, adminOnly, deleteTask );
router.put("/:id/status", protect, updateTaskStatus );   // Update Task Status
router.put("/:id/todo", protect, updateTaskChecklist );   // Update Task Checklist

module.exports = router;