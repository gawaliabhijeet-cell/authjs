import mongoose from "mongoose";
import { verify } from "node:crypto";


const UserSchema = new mongoose.Schema({
    UserName: {
        type: String,
        required: [true, "please a give me username"],
        unique: true,
        
    },
    email :{
        type: String,
        required: [true, "please a give me email"],
        unique: true,
        lowercase: true
    },
    password :{
        type: String,
        required: [true, "please a give me password"],
        
    },
    isverified :{
        type: Boolean,
        default: false
    },
    isAdmin :{
        type: Boolean,
        default: false
    },
    forgotPasswordToken: String,
    forgotPasswordTokenExpiry: Date,
    verifyToken: String,
    verifyTokenExpiry: Date
})

const User = mongoose.models.users || mongoose.model("users", UserSchema)

export default User