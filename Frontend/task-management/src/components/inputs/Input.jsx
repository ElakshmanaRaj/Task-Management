import React, { useState } from 'react';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa6';


const Input = ({ value, onChange, label, type, placeholder }) => {
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div>
      <label className='text-slate-800 text-[13px]'>{label}</label>
      <div className='input-box flex items-center gap-2 border px-3 py-2 rounded-md'>
        <input
          type={type === 'password' ? (showPassword ? 'text' : 'password') : type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className='w-full bg-transparent outline-none'
        />

        {type === 'password' &&
          (showPassword ? (
            <FaRegEye
              size={22}
              className='cursor-pointer text-blue-600'
              onClick={toggleShowPassword}
            />
          ) : (
            <FaRegEyeSlash
              size={22}
              className='cursor-pointer text-slate-400'
              onClick={toggleShowPassword}
            />
          ))}
      </div>
    </div>
  );
};

export default Input;
