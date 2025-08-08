import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import { LuFileSpreadsheet } from "react-icons/lu";
import TaskStatusTabs from "../../components/layouts/TaskStatusTabs";
import TaskCard from "../../components/cards/TaskCard";

const ManageTasks = () => {
  const [alltasks, setAllTasks] = useState([]);
  const [tabs, setTabs] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");
  const navigate = useNavigate();

  const getAllTasks = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.TASKS.GET_ALL_TASKS, {
        params: {
          status: filterStatus === "All" ? "" : filterStatus,
        },
      });

      setAllTasks(response.data?.tasks?.length > 0 ? response.data.tasks : []);

      const statusSummary = response.data?.statusSummary || {};

      const statusArray = [
        { label: "All", count: statusSummary.all || 0 },
        { label: "Pending", count: statusSummary.pendingTasks || 0 },
        { label: "In Progress", count: statusSummary.inProgressTasks || 0 },
        { label: "Completed", count: statusSummary.completedTasks || 0 },
      ];

      setTabs(statusArray);
    } catch (error) {
      console.error("Error get all tasks:", error);
    }
  };

  const handleClick = (taskData) => {
    navigate("/admin/create-tasks", { state: { taskId: taskData._id } });
  };

  // download task report
  const handleDownloadReport = async () => {

    try {
      const response = await axiosInstance.get(API_PATHS.REPORTS.EXPORT_TASKS,{
        responseType:"blob",
      });

      // create url for blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "task_details.xlsx");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error to download the tasks:", error);
    }
  };

  useEffect(() => {
    getAllTasks(filterStatus);
  }, [filterStatus]);



  return (
    <DashboardLayout activeMenu="Manage Tasks">
      <div className="my-5">

        <div className="flex flex-col lg:flex-row lg:items-center justify-between">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-medium">All Tasks</h2>
            <button
                className="download-btn-2"
                onClick={handleDownloadReport}
              >
                <LuFileSpreadsheet className="text-lg" />
                Download Report
              </button>
          </div>

          {tabs?.[0]?.count > 0 && (
            <div className="flex items-center gap-3">
              <TaskStatusTabs
                tabs={tabs}
                activeTab={filterStatus}
                setActiveTab={setFilterStatus}
              />

              <button
                className="download-btn"
                onClick={handleDownloadReport}
              >
                <LuFileSpreadsheet className="text-lg" />
                Download Report
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-4">
          {alltasks.map((item, index)=>(
            <TaskCard 
            key={item._id}
            title={item.title}
            description={item.description}
            priority={item.priority}
            status={item.status}
            progress={
              item.todoChecklist?.length > 0
                ? Math.floor((item.completedTodoCount / item.todoChecklist.length) * 100)
                : 0
            }
            createdAt={item.createdAt}
            dueDate={item.dueDate}
            assignedTo={item.assignedTo?.map((item)=>item.profileImageUrl)}
            attachmentCount={item.attachments?.length || 0}
            completedTodoCount={item.completedTodoCount || 0}
            todoChecklist={item.todoChecklist || []}
            onClick={() => handleClick(item)}
          />
          
          ))}
        </div>

      </div>
    </DashboardLayout>
  );
};

export default ManageTasks;
