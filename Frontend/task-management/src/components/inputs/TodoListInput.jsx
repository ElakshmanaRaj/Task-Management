import React, { useState } from 'react';
import { HiOutlineTrash, HiMiniPlus } from 'react-icons/hi2';

const TodoListInput = ({ todoList, setTodoList }) => {
    const [option, setOption] = useState("");

    // handle Input Options
    const handleAddOption = () => {
        if (option.trim()) {
            setTodoList([...todoList, option.trim()]);
            setOption("");
        }
    };

    // handle Delete Option
    const handleDeleteOption = (index) => {
        const updatedArr = todoList.filter((_, idx) => idx !== index);
        setTodoList(updatedArr);
    };

    return (
        <div>
            {todoList.map((item, index) => (
                <div
                    className='flex justify-between bg-gray-50 border border-gray-300 px-3 py-2 rounded-md mb-3'
                    key={index}
                >
                    <p className='text-xs text-black'>
                        <span className='text-xs text-gray-400 font-semibold mr-2'>
                            {index < 9 ? `0${index + 1}` : index + 1}
                        </span>
                        {item}
                    </p>
                    <button
                        className='cursor-pointer'
                        onClick={() => handleDeleteOption(index)}
                    >
                        <HiOutlineTrash className='text-lg text-red-500' />
                    </button>
                </div>
            ))}

            <div className='flex items-center mt-4 gap-5'>
                <input
                    type="text"
                    placeholder='Enter Task'
                    value={option}
                    onChange={(e) => setOption(e.target.value)}
                    className='w-full outline-none text-black text-[13px] bg-white border border-gray-100 px-3 py-2 rounded-md'
                />
                <button
                    onClick={handleAddOption}
                    className='text-nowrap card-btn'
                >
                    <HiMiniPlus className='text-[25px] font-medium' />
                    Add
                </button>
            </div>
        </div>
    );
};

export default TodoListInput;
