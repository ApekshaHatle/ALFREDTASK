import { generateTokenAndSetCookie } from '../lib/utils/generateToken.js';
import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';

export const signup = async(req,res) => {
    try {
        const { fullName,username,email,password} = req.body;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;        //this will check whether the email is in correct format
		if (!emailRegex.test(email)) {
			return res.status(400).json({ error: "Invalid email format" });         
		}

        const existingUser = await User.findOne({username});    //check if the username already exists
        if(existingUser){
            return res.status(400).json({error: "Username already taken"});
        }

        const existingEmail = await User.findOne({email});    //check if the username already exists
        if(existingEmail){
            return res.status(400).json({error: "Email already taken"});
        }

        if(password.length<6){
            return res.status(400).json({error: "Password must be atleast 6 characters long"})
        }

        //hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);   

        const newUser = new User({
            fullName,
            username,
            email,
            password: hashedPassword
        });

        if(newUser){
            generateTokenAndSetCookie(newUser._id,res)
            await newUser.save();
            
            res.status(201).json({
                _id:newUser._id,
                fullName:newUser.fullName,
                username:newUser.username,
                email:newUser.email,
                followers:newUser.followers,
                following:newUser.following,
                profileImg: newUser.profileImg,
                coverImg: newUser.coverImg,

            });
        }else{
            res.status(400).json({ error:"Invalid user data"});
        }

    } catch (error) {   
        console.log("Error occured in signup controller");

        res.status(500).json({error: "Internal Server Error"});
    }
};

export const login = async(req,res) => {
    try {

        const {username, password} = req.body;
        const user = await User.findOne({username});      //locate the  user in db
        const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");      //compare password (i.e. entered rn) with user.password (in db) and if user is invalid compare with ""
        
        if(!user || !isPasswordCorrect){
            return res.status(400).json({ error: "Invalid username or password" });
        }

        generateTokenAndSetCookie(user._id,res);
        res.status(200).json({
            _id:user._id,
            fullName:user.fullName,
            username:user.username,
            email:user.email,
            followers:user.followers,
            following:user.following,
            profileImg: user.profileImg,
            coverImg: user.coverImg,
        });

    } catch (error) {
        console.log("Error occured in login controller");

        res.status(500).json({error: "Internal Server Error"});
    }
};

export const logout = async(req,res) => {
    try {
        res.cookie("jwt","",{maxAge:0})                          //destroy the cookie
        res.status(200).json("Logged out succesfully");

    } catch (error) {
        console.log("Error occured in logout controller");

        res.status(500).json({error: "Internal Server Error"});
    }
};

export const getMe = async (req,res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        res.status(200).json(user);
    } catch (error) {
        console.log("Error occured in getme controller");

        res.status(500).json({error: "Internal Server Error"});
    }
}