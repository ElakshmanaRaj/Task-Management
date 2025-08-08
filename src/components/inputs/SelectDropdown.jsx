import React, { useState } from 'react';
import { LuChevronDown } from 'react-icons/lu';

const SelectDropdown = ({options,value,placeholder, onChange}) => {
    const[isOpen, setIsOpen] = useState(false);

    const handleSelect = (option)=>{
        onChange(option);
        setIsOpen(false);
    }

  return (


    <div className='relative w-full'>

        <button 
        onClick={()=>setIsOpen(!isOpen)}
        className='w-full text-sm outline-none text-black bg-white border border-slate-400 rounded-md px-2.5 py-3 mt-2 flex items-center justify-between cursor-pointer'>
            {value ? options.find((opt)=> opt.value === value)?.label: placeholder}
            <span>{isOpen ? <LuChevronDown className='rotate-180'/>: <LuChevronDown/>}</span>
        </button>
        
       {isOpen && (
        <div className='w-full bg-white border border-slate-100 rounded-md mt-1 shadow-md z-10'>
            {options.map((option)=>(
                <div 
                className='text-sm px-3 py-2 bg-white rounded-md cursor-pointer hover:bg-gray-100'
                key={option.value}
                onClick={()=>handleSelect(option.value)}>
                    {option.label}
                </div>
            ))}
        </div>
       )}


    </div>
  )
}

export default SelectDropdown;