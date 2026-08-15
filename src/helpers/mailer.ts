import nodemailer from "nodemailer";
import User from "@/models/user.model";
import bcrypt from "bcryptjs";

const transporter = nodemailer.createTransport({
  host: process.env.MAILTRAP_HOST,
  port: Number(process.env.MAILTRAP_PORT),
  secure: false,
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS,
  },
});

export const sendEmail = async ({
  email,
  emailType,
  userId,
}: {
  email: string;
  emailType: "VERIFY" | "RESET";
  userId: string;
}) => {
  try {
    // Generate token
    const hashedToken = await bcrypt.hash(userId.toString(), 10);

    // Save token in database
    if (emailType === "VERIFY") {
      await User.findByIdAndUpdate(userId, {
        verifyToken: hashedToken,
        verifyTokenExpiry: Date.now() + 3600000, // 1 hour
      });
    } else if (emailType === "RESET") {
      await User.findByIdAndUpdate(userId, {
        forgotPasswordToken: hashedToken,
        forgotPasswordTokenExpiry: Date.now() + 3600000, // 1 hour
      });
    }

    // Create verification/reset URL
    const actionUrl =
      emailType === "VERIFY"
        ? `${process.env.DOMAIN}/verifyemail?token=${hashedToken}`
        : `${process.env.DOMAIN}/resetpassword?token=${hashedToken}`;

    // Email content
    const mailOptions = {
      from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM_EMAIL}>`,
      to: email,
      subject:
        emailType === "VERIFY"
          ? "Verify your email"
          : "Reset your password",

      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
          <h2>
            ${
              emailType === "VERIFY"
                ? "Verify Your Email"
                : "Reset Your Password"
            }
          </h2>

          <p>Hello,</p>

          ${
            emailType === "VERIFY"
              ? `<p>Click the button below to verify your email address.</p>`
              : `<p>Click the button below to reset your password.</p>`
          }

          <a
            href="${actionUrl}"
            style="
              display: inline-block;
              padding: 12px 20px;
              background: #007bff;
              color: white;
              text-decoration: none;
              border-radius: 5px;
              margin: 15px 0;
            "
          >
            ${
              emailType === "VERIFY"
                ? "Verify Email"
                : "Reset Password"
            }
          </a>

          <p>This link will expire in 1 hour.</p>

          <p>If you did not request this, you can safely ignore this email.</p>

          <p>Thanks,<br />${process.env.MAIL_FROM_NAME}</p>
        </div>
      `,
    };

    // Send email
    const mailResponse = await transporter.sendMail(mailOptions);

    console.log("Email sent:", mailResponse.messageId);

    return mailResponse;
  } catch (error: any) {
    console.error("Email sending error:", error);
    throw new Error(error.message);
  }
};