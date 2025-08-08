import React, { useEffect, useState } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPath';
import { LuFileSpreadsheet } from 'react-icons/lu';
import UserCard from '../../components/cards/UserCard';

const ManageUser = () => {


  const[allUsers, setAllUsers] = useState([]);

  const getAllUsers = async () => {

    try {

      const response = await axiosInstance.get(API_PATHS.USERS.GET_ALL_USERS);

      if(response.data.length > 0){
        setAllUsers(response.data);
      }
      
    } catch (error) {
      console.error("Error to fetch users:", error);
    }
  }

  useEffect(()=>{
    getAllUsers();
  },[]);

  // download task report

  const handleDownloadReport = async () => {

    try {
      const response = await axiosInstance.get(API_PATHS.REPORTS.EXPORT_TASKS,{
        responseType:"blob"
      })
      
      // Create Url for blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "user_details.xlsx");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error to download task report:", error);
    }
  }

  return (

    <DashboardLayout activeMenu="Team Members">

      <div className='mt-5 mb-10'>

        <div className='flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0'>
          <h2 className='text-xl font-medium'>Team Members</h2>
          <button 
          onClick={handleDownloadReport}
          className='flex items-center gap-3 text-xs md:text-[13px] text-lime-900 bg-lime-100 px-2 md:px-3 py-2 rounded border border-lime-200 hover:border-lime-400 cursor-pointer'>
            <LuFileSpreadsheet className='text-lg'/>  
            Download Report
          </button>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mt-4'>
          {allUsers.map((user)=>(
            <UserCard key={user._id} userinfo={user}/>
          ))}
        </div>

      </div>
    </DashboardLayout>

  )
}

export default ManageUser