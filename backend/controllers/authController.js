const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

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

module.exports = { register, login };