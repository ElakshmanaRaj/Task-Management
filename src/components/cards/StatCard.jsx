import React from 'react'

const StatCard = ({ label, status, count }) => {

    const getStatusTagColor = () => {
        switch (status) {
            case "In Progress":
                return "text-cyan-500 bg-gray-50";
            case "Completed":
                return "text-indigo-500 bg-gray-50";
            default:
                return "text-violet-500 bg-gray-50";
        }
    }

    return (
        <div className={`flex-1 font-medium text-[10px] ${getStatusTagColor()} px-4 py-0.5 rounded`}>
            <span className='text-[12px] font-semibold'>{count}</span> 
            &nbsp; {label}
        </div>
    )
}

export default StatCard;
