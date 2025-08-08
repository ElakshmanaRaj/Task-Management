import React, { useEffect } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { PRIORITY_DATA } from "../../utils/data";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
import { LuTrash2 } from "react-icons/lu";
import { useState } from "react";
import SelectDropdown from "../../components/inputs/SelectDropdown";
import SelectUsers from "../../components/inputs/SelectUsers";
import TodoListInput from "../../components/inputs/TodoListInput";
import AddAttachmentsInput from "../../components/inputs/AddAttachmentsInput";
import Modal from "../../components/layouts/Modal";
import DeleteAlert from "../../components/layouts/DeleteAlert";
import { toast } from 'react-toastify';

const CreateTask = () => {
  const location = useLocation();
  const taskId = location?.state?.taskId || null;
  const navigate = useNavigate();

  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    priority: "Low",
    dueDate: "",
    assignedTo: [],
    todoChecklist: [],
    attachments: [],
  });

  const [currentTask, setCurrentTask] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);

  const handleValueChange = (key, value) => {
    setTaskData((prevData) => ({ ...prevData, [key]: value }));
  };

  // Reset Data
  const clearData = () => {
    setTaskData({
      title: "",
      description: "",
      priority: "Low",
      dueDate: "",
      assignedTo: [],
      todoChecklist: [],
      attachments: [],
    });
  };

  // Create Task
  const createTask = async () => {
    setLoading(true);

    try {
      const todolist = taskData.todoChecklist?.map((item)=>({
        text: item,
        completed: false,
      }));

      const response = await axiosInstance.post(API_PATHS.TASKS.CREATE_TASK,{
        ...taskData,
        dueDate: new Date(taskData.dueDate).toISOString(),
        todoChecklist: todolist,
      });
      clearData();
      toast.success("Task created successfully!");
    } catch (error) {
      console.error("Error creating task:", error);
      setLoading(false);
    } finally{
      setLoading(false);
    }
  };

  // Update Task
  const updateTask = async () => {
    setLoading(true);
    try {
      const prevTodoChecklist = currentTask?.todoChecklist || [];
  
      const todolist = taskData.todoChecklist?.map((item) => {
        const matchedTask = prevTodoChecklist.find((task) => task.text === item.text);
        return {
          text: item.text,
          completed: matchedTask ? matchedTask.completed : item.completed || false,
        };
      });
  
      const response = await axiosInstance.put(API_PATHS.TASKS.UPDATE_TASK(taskId), {
        ...taskData,
        dueDate: new Date(taskData.dueDate).toISOString(),
        todoChecklist: todolist,
      });
      toast.info("Updated task successfully!");
   
    } catch (error) {
      console.error("Error to update tasks:", error);
    } finally {
      setLoading(false);
    }
  };
  

  // get Task
  const getTaskDetailById = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.TASKS.GET_TASK_BY_ID(taskId));

      if(response.data){
        const taskInfo = response.data;
        setCurrentTask(taskInfo);

        setTaskData((prevState)=>({
          title: taskInfo.title,
          description: taskInfo.description,
          priority: taskInfo.priority,
          dueDate: taskInfo.dueDate ? moment(taskInfo.dueDate).format("YYYY-MM-DD") : null,
          assignedTo: taskInfo?.assignedTo?.map((item)=> item?._id) || [],
          todoChecklist: taskInfo?.todoChecklist?.map((item)=>item?.text) || [],
          attachments: taskInfo?.attachments || [],
        }));
      }


    } catch (error) {
      console.error("Error getting tasks by ID:", error)
    }
  };

  // Delete Task
  const deleteTask = async () => {
    try {
      await axiosInstance.delete(API_PATHS.TASKS.DELETE_TASK(taskId));
      setOpenDeleteAlert(false);
      navigate("/admin/tasks");
      
    } catch (error) {
      console.error("Error to delete the task:", error)
      
    }
  };


  useEffect(() => {
    if (taskId) {
      getTaskDetailById(taskId);
    }
  }, [taskId]);

  // Submit the form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Input Validation

    if (!taskData.title.trim()) {
      setError("Title is required");
      return;
    }

    if (!taskData.description.trim()) {
      setError("Description is required");
      return;
    }

    if (!taskData.dueDate) {
      setError("Due Date is required");
      return;
    }

    if (!taskData.assignedTo || taskData.assignedTo.length === 0) {
      setError("Task not assigned to any member");
      return;
    }
    
    if (!taskData.todoChecklist || taskData.todoChecklist.length === 0) {
      setError("Add at least one task");
      return;
    }

    if (taskId) {
      updateTask();
    } else {
      createTask();
    }
  };
  return (
    <DashboardLayout activeMenu="Create Tasks">
      <div className="mt-5 mb-3">
        <div className="grid grid-cols-1 md:grid-cols-4 mt-4">
          <div className="col-span-3 form-card">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-medium">
                {taskId ? "Update Taask" : "Create Task"}
              </h2>
              {taskId && (
                <button
                  className="flex items-center gap-1.5 font-medium text-[13px] text-red-500 bg-rose-50 px-2 py-2 rounded border border-rose-100 hover:border-rose-300 cursor-pointer"
                  onClick={() => setOpenDeleteAlert(true)}
                >
                  <LuTrash2 className="text-base" /> Delete
                </button>
              )}
            </div>

            <div className="mt-4">
              <label className="font-medium text-slate-600 text-xs">
                Task Title &nbsp;
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="Create App UI"
                value={taskData.title || ""}
                onChange={({ target }) => {
                  handleValueChange("title", target.value);
                }}
              />
            </div>

            <div className="mt-3">
              <label className="text-xs font-medium text-slate-600">
                Description
              </label>
              <textarea
                className="form-input"
                placeholder="Describe Task"
                rows={4}
                value={taskData.description}
                onChange={({ target }) => {
                  handleValueChange("description", target.value);
                }}
              ></textarea>
            </div>

            <div className="grid grid-cols-12 gap-4 mt-2">
              <div className="col-span-6 md:col-span-4">
                <label className="text-xs font-medium text-slate-600">
                  Priority
                </label>
                <SelectDropdown
                  options={PRIORITY_DATA}
                  value={taskData.priority}
                  onChange={(value) => handleValueChange("priority", value)}
                />
              </div>

              <div className="col-span-6 md:col-span-4">
                <label className="text-xs font-medium text-slate-600">
                  Due Date
                </label>
                <input
                  type="date"
                  value={taskData.dueDate}
                  onChange={(e) => handleValueChange("dueDate", e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="col-span-12 md:col-span-3">
                <label className="text-xs font-medium text-slate-600">
                  Assign To
                </label>
                <SelectUsers
                  selectedUsers={taskData.assignedTo}
                  setSelectedUsers={(value) =>
                    handleValueChange("assignedTo", value)
                  }
                />
              </div>
            </div>

            <div className="mt-3">
              <label className="text-xs font-medium text-slate-600">
                TODO Checklist
              </label>
              <TodoListInput
                todoList={taskData.todoChecklist}
                setTodoList={(value) =>
                  handleValueChange("todoChecklist", value)
                }
              />
            </div>

            <div className="mt-3">
              <label className="text-xs font-medium text-slate-600">
                Add Attachments
              </label>
              <AddAttachmentsInput
                attachments={taskData.attachments}
                setAttachments={(value) =>
                  handleValueChange("attachments", value)
                }
              />
            </div>

            {error && (
              <p className="text-xs font-medium text-red-500 mt-5">{error}</p>
            )}

            <div className="flex justify-end mt-7">
              <button
                className="add-btn"
                disabled={loading}
                onClick={handleSubmit}
              >
                {taskId ? "UPDATE TASK" : "CREATE TASK"}
              </button>
            </div>
          </div>
        </div>
      </div>
      <Modal 
      isOpen={openDeleteAlert}
      title="Delete Task"
      onClose={()=>setOpenDeleteAlert(false)}
      >
        <DeleteAlert 
        content="Are you sure want to delete this task?"
        onDelete={()=>deleteTask()}
        />
      </Modal>
    </DashboardLayout>
  );
};

export default CreateTask;
