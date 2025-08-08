
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Generate Token
const generateToken = (userId)=>{
    return jwt.sign(
        {
            id: userId
        },
        process.env.JWT_SECRET,
        {
            expiresIn:"30d"
        }
    )
}


// Register New User (POST)
// access Public
const registerUser = async(req, res)=>{
    try {
        const { name, email, password, profileImageUrl, adminInviteToken } = req.body;

        // check if user already exists
        const userExist = await User.findOne({email});
        if(userExist){
            return res.status(400).json({message:"This email already exists, Add new email"})
        }

        // determine user role: Verify given admin token
        let role = "member"
        if( adminInviteToken && adminInviteToken === process.env.ADMIN_INVITE_TOKEN){
            role = "admin"
        }

        // Hash Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create User
        const user = await User.create(
            {
                name,
                email,
                password:hashedPassword,
                profileImageUrl,
                role
            }
        );

        res.status(201).json({
            success:true,
            _id:user._id,
            name:user.name,
            email:user.email,
            profileImageUrl:user.profileImageUrl,
            role:user.role,
            token:generateToken(user._id),
        });

    } catch (error) {
        res.status(500).json({message:"Server Error", error: error.message});
    }
}

// Login User (POST)
// access Public

const loginUser = async(req, res)=> {

    try {

        const {email, password} = req.body;

        // Check Email Match
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({message:"Invalid email or password", success:false})
        }

        // Check Password Match
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({message:"Invalid email or password", success:false});
        }

        // Login Success Return User Data with JWT

        res.json({
            success:true,
            id:user._id,
            name:user.name,
            email:user.email,
            role:user.role,
            profileImageUrl: user.profileImageUrl,
            token:generateToken(user._id),
        });
        
    } catch (error) {
        res.status(500).json({message:"Server Error", error: error.message});
    }
}

// get User Profile (GET)
// private (Requires JWT Token)
const getUserProfile = async (req, res) => {

    try {
        const user = await User.findById(req.user.id).select("-password");
        if(!user){
            return res.status(404).json({success:false, message:"User not found"});
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({message:"Server Error", error: error.message});
    }

}

// update User Profile (PUT)
// private (Requires JWT Token)
const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if(!user){
            return res.status(404).json({success:false, message:"User not found"});
        }
        
        user.name = user.body.name || user.name;
        user.email = user.body.email || user.email;

        if(user.body.password){
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(req.body.password, salt);
        }

        const updateUser = await user.save();
        res.json(
            {
                _id: updateUser._id,
                name:updateUser.name,
                email:updateUser.email,
                role:updateUser.role,
                token: generateToken(updateUser._id)
            }
        );
        
    } catch (error) {
        res.status(500).json({message:"Server Error", error: error.message});
    }
}

module.exports = {registerUser, loginUser, getUserProfile, updateUserProfile};

