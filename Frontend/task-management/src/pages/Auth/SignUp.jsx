import React, { useState } from "react";
import AuthLayout from "../../components/layouts/AuthLayout";
import Input from "../../components/inputs/Input";
import { validateEmail } from "../../utils/helper";
import ProfilePhotoSelector from "../../components/inputs/ProfilePhotoSelector";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import { useContext } from "react";
import { UserContext } from "../../context/userContext";
import uploadImage from "../../utils/uploadImage";


const SignUp = () => {
  const [profilePic, setProfilePic] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminInviteToken, setAdminInviteToken] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const{updateUser} = useContext(UserContext);

  const handleSignup = async (e) => {
    e.preventDefault();

    let profileImageUrl = "";

    // Validate Input Fields
    if (!name) {
      setError("Please enter the name");
      return;
    }

    if (!email) {
      setError("Please enter email address");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter valid email address");
      return;
    }

    if (!password) {
      setError("Please enter the password");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    setError("");

    // API Call
    try {

      // Upload if any image present
      if(profilePic){
        const imgUpload = await uploadImage(profilePic);
        profileImageUrl = imgUpload.imageUrl  || "";
      }

      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER,{
        name,
        email, 
        password,
        profileImageUrl,
        adminInviteToken
      });

      const {role, token} = await response.data;

      if(token){
        localStorage.setItem("token", token);
        updateUser(response.data)
      }

      // Redirect based on role
      if(role === "admin"){
        navigate("/admin/dashboard");
      } else{
        navigate("/user/dashboard");
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
      <div className="lg:w-[100%] h-auto md:h-full mb-5 md:mb-0 mt-10 md:mt-0 flex flex-col justify-center">
        <h3 className="text-xl font-semibold text-black">Create an Account</h3>
        <p className="text-xs text-slate-700 mt-[15px] mb-6">
          Join us today by entering your details below
        </p>

        <form onSubmit={handleSignup}>
          <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <Input
              value={name}
              onChange={({ target }) => setName(target.value)}
              label="Enter Full name *"
              placeholder="John Doe"
              type="text"
            />

            <Input
              value={email}
              onChange={({ target }) => setEmail(target.value)}
              type="text"
              placeholder="john@gmail.com"
              label="Email Address *"
            />

            <Input
              value={password}
              onChange={({ target }) => setPassword(target.value)}
              type="password"
              placeholder="Min 8 characters"
              label="Password *"
            />

            <Input
              value={adminInviteToken}
              onChange={({ target }) => setAdminInviteToken(target.value)}
              type="text"
              placeholder="7 Digit code"
              label="Admin Invite Token"
            />

          </div>

          
          {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}
            <button
              type="submit"
              className="bg-teal-600 font-medium w-full text-white px-4 py-1.5 mt-2 rounded uppercase cursor-pointer transition-all hover:bg-teal-700"
            >
              SignUp
            </button>
            <p className="text-[13px] mt-3 text-slate-800">
            Alread have an account?{""}
            <Link
              className="underline font-medium text-blue-400 px-2"
              to="/login"
            >
              LogIn
            </Link>
            </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default SignUp;
