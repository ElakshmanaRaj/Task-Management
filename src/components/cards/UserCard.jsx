import React from 'react'
import StatCard from './StatCard'

const UserCard = ({userinfo}) => {

  return (
    <div className='p-2 user-card'>
        <div className='flex items-center justify-between'>
            <div className='flex items-center gap-3'>
                <img src={userinfo?.profileImageUrl} alt="Avatar" className='w-12 h-12 rounded-full border-2 border-white' />
            <div>
                <p className='text-sm font-medium'>{userinfo?.name}</p>
                <p className='text-xs text-gray-500'>{userinfo?.email}</p>
            </div>
            </div>
        </div>

        <div className='flex items-end gap-3 mt-5'>
            <StatCard 
            label="Pending"
            status="Pending" 
            count={userinfo?.pendingTasks || 0}
            />
            <StatCard 
            label="In Progress"
            status="In Progress" 
            count={userinfo?.inProgressTasks || 0}
            />
            <StatCard 
            label="Completed"
            status="Completed" 
            count={userinfo?.completedTasks || 0}
            />
        </div>

    </div>


  )
}

export default UserCard