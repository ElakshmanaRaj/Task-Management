const Task = require("../models/Task");

// Admin Access Only
// Get All Tasks
const getTasks = async (req, res) => {
    try {
      const { status } = req.query;
      const userId = req.user._id;
      const isAdmin = req.user.role === "admin";
  
      // Base filter
      let filter = {};
      if (status) filter.status = status;
      if (!isAdmin) filter.assignedTo = userId;
  
      // Get tasks
      let tasks = await Task.find(filter).populate("assignedTo", "name email profileImageUrl");
  
      // Add completedTodoCount to each task
      tasks = await Promise.all(
        tasks.map((task) => {
          const completedCount = task.todoChecklist.filter((item) => item.completed).length;
          return { ...task._doc, completedTodoCount: completedCount };
        })
      );
  
      // Status summary (corrected with separate filters)
      const baseFilter = isAdmin ? {} : { assignedTo: userId };
  
      const allTasks = await Task.countDocuments(baseFilter);
      const pendingTasks = await Task.countDocuments({ ...baseFilter, status: "Pending" });
      const inProgressTasks = await Task.countDocuments({ ...baseFilter, status: "In Progress" });
      const completedTasks = await Task.countDocuments({ ...baseFilter, status: "Completed" });
  
      res.json({
        tasks,
        statusSummary: {
          all: allTasks,
          pendingTasks,
          inProgressTasks,
          completedTasks,
        },
      });
  
    } catch (error) {
      res.status(500).json({ message: "Server Error", error: error.message });
    }
  };
  
// Get Task By Id
// Private Access
const getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id).populate("assignedTo", "name email profileImageUrl");

        if (!task) {
            return res.status(404).json({ message: "No Task Found" });
        }

        res.status(200).json(task);
        
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};



// Create new Task
// Admin access

const createTask = async (req, res) => {
    try {

        const { title, description, priority, dueDate,  assignedTo, attachments, todoChecklist}= req.body;

        if(!Array.isArray(assignedTo)){
            return res.status(400).json({message:"assigned must be an array of user IDs"});
        }

        const task = await Task.create({
            title,
            description,
            priority,
            dueDate,
            assignedTo,
            createdBy:req.user._id,
            todoChecklist,
            attachments
        });

        res.status(200).json({success:true, message:"Task created successfully", task});
        
    } catch (error) {
        res.status(500).json({message:"Server Error", error:error.message});
    }
};


// Update Task 
// Private access
const updateTask = async (req, res) => {
    try {

        const task = await Task.findById(req.params.id);

        if(!task) return res.status(404).json({message:"No Task Found"});
        task.title = req.body.title || task.title;
        task.description = req.body.description || task.description;
        task.priority = req.body.priority || task.priority;
        task.dueDate = req.body.dueDate || task.dueDate;
        task.todoChecklist = req.body.todoCheckList || task.todoChecklist;
        task.attachments = req.body.attachments || task.attachments;

        if(req.body.assignedTo){
            if(!Array.isArray(req.body.assignedTo)){
                return res.status(400).json({message:"assigned must be an array of user IDs"})
            }
            task.assignedTo = req.body.assignedTo;
        }

        const updatedTask = await task.save();
        res.json({message:"Updated Task successfully", updatedTask});
        
    } catch (error) {
        res.status(500).json({message:"Server Error", error:error.message});
    }   
}


// Delete Task
// Admin Access

const deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if(!task) return res.status(404).json({message:"Task not found"});
        await task.deleteOne();
        res.json({message:"Task deleted successfully"})
        
    } catch (error) {
        res.status(500).json({message:"Server Error", error:error.message});
    }
}


// Update Status
// Private Access
const updateTaskStatus = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if(!task) return res.status(404).json({message:"Task not found"});

        const isAssigned = task.assignedTo.some((userId)=> userId.toString() === req.user._id.toString());

        if(!isAssigned && req.user.role !== "admin"){
            return res.status(403).json({message:"Not authorized"});
        }

        task.status = req.body.status || task.status;
        if(task.status === "Completed"){
            task.todoChecklist.forEach((item)=>(item.completed = true));
            task.progress = 100;
        }

        await task.save();
        res.json({message:"task status updated", task});
        
    } catch (error) {
        res.status(500).json({message:"Server Error", error:error.message});
    }
}


// Update Task Checklist
// Private Access
const updateTaskChecklist = async (req, res) => {
    try {
        const { todoChecklist } = req.body; 
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: "Task not found" });

        if (!task.assignedTo.includes(req.user._id) && req.user.role !== "admin") {
            return res.status(403).json({ message: "Not authorized" });
        }

        task.todoChecklist = todoChecklist; 

        // Auto Update Progress on checklist
        const completedCount = task.todoChecklist.filter((item) => item.completed).length;
        const totalItems = task.todoChecklist.length;
        task.progress = totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0;

        // Auto-mark as completed
        if (task.progress === 100) {
            task.status = "Completed";
        } else if (task.progress > 0) {
            task.status = "In Progress";
        } else {
            task.status = "Pending";
        }

        await task.save();
        const updatedTask = await Task.findById(req.params.id).populate("assignedTo", "name email profileImageUrl");
        res.json({ message: "Task checklist updated", task: updatedTask });

    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};



// Get Dashboard Data
// Admin Access

const getDashboardData = async (req, res) => {
    try {
        const totalTasks = await Task.countDocuments();
        const pendingTasks = await Task.countDocuments({ status: "Pending" });
        const inProgressTasks = await Task.countDocuments({ status: "In Progress" });
        const completedTasks = await Task.countDocuments({ status: "Completed" });
        const overDueTasks = await Task.countDocuments({
            status: { $ne: "Completed" },
            dueDate: { $lt: new Date() },
        });

        const taskStatuses = ["Pending", "In Progress", "Completed"];
        const taskDistributeRaw = await Task.aggregate([
            {
                $group: {
                    _id: "$status", 
                    count: { $sum: 1 },
                },
            },
        ]);

        const taskDistribution = taskStatuses.reduce((acc, status) => {
            const formattedKey = status.replace(/\s+/g, "");
            acc[formattedKey] = taskDistributeRaw.find((item) => item._id === status)?.count || 0;
            return acc;
        }, {});
        taskDistribution["All"] = totalTasks;

        const taskPriorities = ["Low", "Medium", "High"];
        const taskPriorityLevelsRaw = await Task.aggregate([
            {
                $group: {
                    _id: "$priority",
                    count: { $sum: 1 },
                },
            },
        ]);

        const taskPriorityLevels = taskPriorities.reduce((acc, priority) => {
            acc[priority] = taskPriorityLevelsRaw.find((item) => item._id === priority)?.count || 0;
            return acc; 
        }, {});

        const recentTasks = await Task.find()
            .sort({ createdAt: -1 })
            .limit(10)
            .select("title status priority dueDate createdAt");

        res.status(200).json({
            statistics: {
                totalTasks,
                pendingTasks,
                inProgressTasks,
                completedTasks,
                overDueTasks,
            },
            charts: {
                taskDistribution,
                taskPriorityLevels,
            },
            recentTasks,
        });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};


// Dashboard Data
// Private Access
const getUserDashboardData = async (req, res) => {
    try {
        const userId = req.user._id;

        const totalTasks = await Task.countDocuments({ assignedTo: userId });
        const pendingTasks = await Task.countDocuments({ assignedTo: userId, status: "Pending" });
        const completedTasks = await Task.countDocuments({ assignedTo: userId, status: "Completed" });
        const overDueTasks = await Task.countDocuments({
            assignedTo: userId,
            status: { $ne: "Completed" },
            dueDate: { $lt: new Date() },
        });

        const taskStatuses = ["Pending", "In Progress", "Completed"];

        // 👇 Fix: Only aggregate for the current user
        const taskDistributeRaw = await Task.aggregate([
            { $match: { assignedTo: userId } },
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 },
                },
            },
        ]);

        const taskDistribution = taskStatuses.reduce((acc, status) => {
            const formattedKey = status.replace(/\s+/g, "");
            acc[formattedKey] = taskDistributeRaw.find(item => item._id === status)?.count || 0;
            return acc;
        }, {});

        taskDistribution["All"] = totalTasks;

        // Priority Distribution
        const taskPriorities = ["Low", "Medium", "High"];
        const taskPriorityLevelsRaw = await Task.aggregate([
            { $match: { assignedTo: userId } },
            {
                $group: {
                    _id: "$priority",
                    count: { $sum: 1 },
                },
            },
        ]);

        const taskPriorityLevels = taskPriorities.reduce((acc, priority) => {
            acc[priority] = taskPriorityLevelsRaw.find(item => item._id === priority)?.count || 0;
            return acc;
        }, {});

        // Recent tasks for the current user
        const recentTasks = await Task.find({ assignedTo: userId })
            .sort({ createdAt: -1 })
            .limit(10)
            .select("title status priority dueDate createdAt");

        res.status(200).json({
            statistics: {
                totalTasks,
                pendingTasks,
                completedTasks,
                overDueTasks,
            },
            charts: {
                taskDistribution,
                taskPriorityLevels,
            },
            recentTasks,
        });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};


module.exports = { getTasks, getTaskById, getDashboardData, getUserDashboardData, updateTask, updateTaskStatus, updateTaskChecklist, createTask, deleteTask }