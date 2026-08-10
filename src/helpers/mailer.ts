import nodemailer from "nodemailer"
import User from "@/models/user.model";
import bcrypt from "bcryptjs";


export const sendEmail = async({email, emailType, userId}:any) => {
    try {
            //TODO : configure mail for usage

            const hashedToken = await bcrypt.hash(userId.toString(), 10)
            if(emailType === "VERIFY"){
                await User.findByIdAndUpdate(userId,
                    {
                        verifyToken: hashedToken,
                        verifyTokenEpiry: Date.now() + 3600000
                    }
                )
            }else if(emailType === "RESET"){
                await User.findByIdAndUpdate(userId,
                    {
                        forgotPasswordToken: hashedToken,
                        forgotPasswordTokenExpiry: Date.now() + 36000000
                    }
                )
            }


        const nodemailer = require("nodemailer");

           // Create a transporter using SMTP
          const transporter = nodemailer.createTransport({
            host: "smtp.example.com",
            port: 587,
            secure: false, // use STARTTLS (upgrade connection to TLS after connecting)
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
            });

             const mailOptions = {
                from: 'abhij@gmail.com', // sender address
                to: email, // list of recipients
                subject: emailType === 'VERIFY'? "Verify your email": "Reset your password", // subject line
                html: "<b>Hello world?</b>", // HTML body
            }

            const mailResponce = await transporter.sendMail(mailOptions)
            return mailResponce

    } catch (error:any) {
        throw new Error(error.message)
    }
}