import React, { useState } from 'react'
import { HiOutlineX, HiOutlineMenu } from "react-icons/hi"
import Sidebar from './Sidebar'

const Navbar = ({ activeMenu }) => {
  const [openSideMenu, setOpenSideMenu] = useState(false);

  return (
    <>
 
      <div className='flex items-center bg-white border-b border-gray-200/50 backdrop-blur-[2px] py-4 px-7 sticky top-0 left-0 z-50'>

        <button
          className='lg:hidden text-black'
          onClick={() => setOpenSideMenu(!openSideMenu)}
        >
          {openSideMenu ? (
            <HiOutlineX className='text-2xl' />
          ) : (
            <HiOutlineMenu className='text-2xl' />
          )}
        </button>

    
        <h2 className='text-lg font-semibold text-black ml-4 lg:ml-0'>Task Manager</h2>
      </div>

      {/* Sidebar for Mobile */}
      {openSideMenu && (
        <div className='fixed top-0 left-0 max-w-xs h-full bg-white shadow-md z-40 lg:hidden'>
          <Sidebar activeMenu={activeMenu} />
        </div>
      )}
    </>
  );
}

export default Navbar;
