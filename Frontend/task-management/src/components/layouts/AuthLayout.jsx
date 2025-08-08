import React from "react";
import UI_IMG from "../../assets/images/Authentication.webp";

const AuthLayout = ({ children }) => {
  return (
    <div className="flex">
      <div className="w-screen h-screen md:w-[60vw] px-12 pt-8 pb-12 overflow-hidden">
        <h2 className="text-lg font-medium text-black">Task Manager</h2>
        {children}
      </div>

      <div className="hidden md:flex w-[40vw] h-screen items-center justify-center bg-blue-400  overflow-hidden">
        <img src={UI_IMG} alt="authentication" />
      </div>
    </div>
  );
};

export default AuthLayout;
