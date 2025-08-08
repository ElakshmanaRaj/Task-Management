import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { UserContext } from "../../context/userContext";
import { useNavigate } from "react-router-dom";
import { SIDE_MENU_DATA, SIDE_MENU_USER_DATA } from "../../utils/data";

const Sidebar = ({ activeMenu }) => {
  const { user, clearUser } = useContext(UserContext);
  const [sideMenuData, setSideMenuData] = useState([]);
  const navigate = useNavigate();

  const handleClick = (route) => {
    if (route === "logout") {
      handleLogout();
    } else {
      navigate(route);
    }
  };
  
  

  const handleLogout = () => {
    localStorage.clear();
    clearUser();
    navigate("login");
  };

  useEffect(() => {
    if (user) {
      setSideMenuData(
        user?.role === "admin" ? SIDE_MENU_DATA : SIDE_MENU_USER_DATA
      );
    }

    return () => {};
  }, [user]);

  return (
    <div className="w-64 border-r border-gray-200/50 h-[calc(100vh-61px)] sticky top-[50px] lg:top-[15px] z-50">
      <div className="flex flex-col items-center justify-center mb-7 pt-5">
        <div className="relative">
          <img
            className="w-20 h-20 object-cover rounded-full bg-slate-400"
            src={user.profileImageUrl || ""}
            alt="Profile Image"
          />
        </div>

        {user?.role === "admin" && (
          <div className="text-[10px] font-semibold text-white bg-blue-700 px-3 py-0.5 mt-2 rounded">
            Admin
          </div>
        )}
        
        {user?.role === "member" && (
          <div className="text-[10px] font-semibold text-white bg-blue-700 px-3 py-0.5 mt-2 rounded">
            User
          </div>
        )}

        <h5 className="font-medium text-gray-950 leading-6 mt-3">
          {user?.name || ""}
        </h5>

        <p className="text-gray-500 text-[12px]">{user.email || ""}</p>
      </div>

      {sideMenuData.map((item, index) => (
        <button
          key={`menu_${index}`}
          className={`w-full flex items-center gap-4 text-[15px] hover:bg-gradient-to-r from-blue-50/40 to-blue-100/50 hover:text-blue-600 transition-all ${
            activeMenu === item.label
              ? "text-blue-600 border-r-3 bg-gradient-to-r from-blue-50/40 to-blue-100/50"
              : ""
          } 
        py-3 px-6 mb-3 cursor-pointer`}
          onClick={() => handleClick(item.path)}
        >
          <item.icon className="text-xl" />
          {item.label}
        </button>
      ))}
    </div>
  );
};

export default Sidebar;
