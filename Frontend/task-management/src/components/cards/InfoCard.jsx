import React from 'react'

const InfoCard = ({icon, label, value, color}) => {
  return (
    <div className='flex gap-3 items-center'>
        <div className={`${color} w-2 md:w-2 h-3 md:h-5 rounded-full`}/>
            <p className='text-xs md:text-[14px] text-gray-500'>
                <span className='text-sm font-semibold text-black md:text-[15px]'>{value}</span> 
                 &nbsp;{label}
            </p>
    </div>
  )
}

export default InfoCard