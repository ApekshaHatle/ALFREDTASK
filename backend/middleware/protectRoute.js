import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const protectRoute = async(req,res,next) => {
    try {
        const token = req.cookies.jwt;                     //getting token from cookie
        if(!token){                                        //if no token
            return res.status(401).json({error : "Unauthorized : No Token Provided"})      // you need to login first!!
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);            // verify token .. it should match JWT_SECRET after decoding
                                                                             

        if(!decoded){                                                         //there is a cookies but invalid
            return res.status(401).json({error:"Unauthorized : Invalid Token"})
        }

        const user = await User.findById(decoded.userId).select("-password");      //passed thru those 2 so we have a VALID TOKEN  (we don't need to pass the password!!)

        if(!user){
            return res.status(401).json({error : "User Not Found"})
        }

        req.user = user;
        next();
    } catch (error) {
        console.log("Error in protectRoute middleware", error.message);
		return res.status(500).json({ error: "Internal Server Error" });
    }
}
