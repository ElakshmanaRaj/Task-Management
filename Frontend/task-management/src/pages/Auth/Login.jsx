import React, { useContext, useState } from "react";
import AuthLayout from "../../components/layouts/AuthLayout";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/inputs/input";
import {validateEmail} from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import { UserContext } from "../../context/userContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const{updateUser} = useContext(UserContext);
  const navigate = useNavigate();

 
  
  // Login submit
  const handleLogin = async (e) => {
    e.preventDefault();

    // Validate input fileds
    if(!validateEmail(email)){
      setError("Please enter valid email address");
      return;
    };

    if(!password){
      setError("Please enter the password");
      return;
    }
    setError("")

    // API Call

    try {

      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password
      });

      const {token, role } = await response.data;

      if(token){
        localStorage.setItem("token", token);
        updateUser(response.data);
      

      // Redirect based on role
      if(role === "admin"){
        navigate("/admin/dashboard");
      } else{
        navigate("/user/dashboard");
      }
    }

    } catch (error) {

      if(error.response && error.response.data.message ){
        setError(error.response.data.message);
      } else {
        setError("Something went wrong, Please try again later");
      }
    }


  };




  return (


    <AuthLayout>
      <div className="lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center">
        <h3 className="text-xl font-bold text-black">Welcome Back</h3>
        <p className="text-xs text-slate-700 mt-[5px] mb-6">
          Please enter your login details
        </p>

        <form onSubmit={handleLogin}>
          <Input
            value={email}
            onChange={({ target }) => setEmail(target.value)}
            type="text"
            placeholder="john@gmail.com"
            label="Email Address"
          />

          <Input
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            type="password"
            placeholder="Min 8 characters"
            label="Password"
          />

          {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}
          <button
            type="submit"
            className="bg-teal-600 font-medium w-full text-white px-4 py-1.5 mt-2 rounded cursor-pointer transition-all hover:bg-teal-700"
          >
            LOGIN
          </button>
          <p className="text-[13px] mt-3 text-slate-800">
            Don't have an account?{""}
            <Link
              className="underline font-medium text-blue-400 px-2"
              to="/signup"
            >
              SignUp
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>

  );


};

export default Login;
