import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/user.model"
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { sendEmail } from "@/helpers/mailer";

connect()

export async function POST(request: NextRequest){
    try{
        const reqBody = await request.json()
        const {UserName, email, password} = reqBody
        // validation
        console.log(reqBody);

        const user = await User.findOne({email})

        if(user){
            return NextResponse.json(
                {
                    error: "User already exits"
                },{
                    status: 400
                }
            )
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

       const newUser = new User({
            UserName,
            email,
            password: hashedPassword
        })

      const savedUser =  await newUser.save()
      console.log(savedUser);

      const userId = savedUser._id
      // send verification email
        await sendEmail({
            email,
            emailType: "VERIFY",
            userId: userId
        })

      return NextResponse.json({
        message: "User registered sucessfully",
        success: true,
        savedUser
      })
        
    }catch(error: any){
        return NextResponse.json({error: error.message},
            {status: 500}
        )
    }
}