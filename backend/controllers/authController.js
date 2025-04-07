const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const { MailerSend, EmailParams, Sender, Recipient } = require("mailersend");
require("dotenv").config();


const register = async (req, res) => {
    try {
        const {displayName, email, password} = req.body

        if (!(displayName && email && password)) {
            return res.status(400).send("All fields are required.") //check if all fields are filled
        }

        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(401).send("Email already in use.") //check if user with email already exists
        }

        const encryptedPassword = await bcrypt.hash(password, 10) //hashes the password

        const user = await User.create({
            displayName, email, password: encryptedPassword
        })

        const token = jwt.sign(
            {id: user._id, email},
            process.env.JWT_SECRET,
            {
                expiresIn: "24h" //token expires in 24 hours
            }
        );
        user.token = token
        user.password = undefined //password woudn't be included in the response

        res.status(201).json(user)
        
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal server error");
    }
}

const login =  async (req, res) => {
    try {
        const {email, password} = req.body

        if (!(email && password)) {
            return res.status(400).send("Email and pasword are required.") //check if both fields are filled
        }

        const user = await User.findOne({email})

        if (!user) {
            return res.status(401).send("Invalid credentials.") //check if user is found
        }

        if (user && (await bcrypt.compare(password, user.password))) {
            const token = jwt.sign(
                    {id: user._id},
                    process.env.JWT_SECRET,
                {
                    expiresIn: "24h"
                }
            );
            user.token = token;
            user.password = undefined;

                const options = {
                    expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                    httpOnly: true
                }
                res.status(200).cookie("token", token, options).json({ //creates the cookie upon logging in
                    success: true,
                    token,
                    user
                })
        }
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal server error");
    }
};

const forgotPassword = async (req, res) => {
    const { email } = req.body;
  
    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }
  
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "No user found with that email." });
      }
  
      const token = crypto.randomBytes(32).toString("hex");
      user.resetPasswordToken = token;
      user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
      await user.save();
  
      const resetUrl = `http://localhost:3000/reset-password/${token}`;
  
      const emailParams = new EmailParams()
        .setFrom(sentFrom)
        .setTo([new Recipient(user.email, user.displayName || "User")])
        .setSubject("Password Reset Request")
        .setHtml(`
          <p>Hello ${user.displayName || ""},</p>
          <p>You requested a password reset.</p>
          <p><a href="${resetUrl}">Click here to reset your password</a></p>
          <p>This link will expire in 1 hour.</p>
        `);
  
      await mailerSend.email.send(emailParams);
  
      res.status(200).json({ message: "Password reset link sent to your email." });
    } catch (error) {
      console.error("Error sending email:", error);
      res.status(500).json({ message: "Error sending email." });
    }
  };
  
const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    console.log("Received new password from frontend:", password);

    try {
    const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
        console.log("Reset failed: invalid or expired token");
        return res.status(400).json({ message: "Invalid or expired token." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Perform DB update directly
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    
    console.log("Password was reset for:", user.email);
    console.log("New hashed password:", hashedPassword);

    res.status(200).json({ message: "Password has been reset successfully." });
    } catch (err) {
    console.error("Reset error:", err);
    res.status(500).json({ message: "Something went wrong." });
    }
};

const mailerSend = new MailerSend({
    apiKey: process.env.MAILERSEND_API_KEY,
  });
  
const sentFrom = new Sender(
"no-reply@trial-xkjn41m2x5p4z781.mlsender.net", // 👈 your verified MailerSend sandbox domain
"Endowment Portal"
);

module.exports = {
    register,
    login,
    forgotPassword,
    resetPassword,
  };