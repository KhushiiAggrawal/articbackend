import jwt from "jsonwebtoken";
import { usersModel } from "../models/Users.js";
import { sendCookie, sendResetMail } from "../utils/services.js";


export const forgotpwd = async (req,res)=>{
    const {email} = req.body;
    const user = await usersModel.findOne({email});
    if(!user){
        return res.status(404).json({success:false,message:"User not found!"});
    }
    const secret =  process.env.JWT_KEY + user.password;
    const payload = {
        email,
        _id:user._id,
    }
    const token = jwt.sign(payload,secret,{expiresIn:"15m"});
    const link = `https://articverse.vercel.app/resetpwd?id=${user._id}&token=${token}`;
    sendResetMail(user.firstname,new Date().toLocaleDateString(),process.env.FROM,process.env.PASS,email,"Artic:Reset Password",link);
    sendCookie(true,user,res,"Check your mail",201);
}
export const resetpwd = async (req,res)=>{
    
}