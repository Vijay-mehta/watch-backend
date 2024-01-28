const express = require("express");
require("../db/config");
const user = require("../db/user");
const jwt = require('jsonwebtoken');
const jwtKey = 'e-comm';
const bcrypt = require('bcrypt');
const cors = require('cors')
const app = express();
app.use(express.json())
app.use(cors());




module.exports = {
    register: async (req, res) => {
        
    
        try {
            const { name, email, password } = req.body;
    
            let errorMessage = "";
           if (!req.file) {
                errorMessage = "Missing 'image' field";
            }
            else if (!name) {
                errorMessage = "Missing 'name' field";
            } else if (!email) {
                errorMessage = "Missing 'email' field";
            } else if (!password) {
                errorMessage = "Missing 'password' field";
            }  
    
            if (errorMessage !== "") {
                return res.status(400).json({ error: errorMessage });
            }
    
            const userExists = await user.findOne({ email });
            if (userExists) {
                return res.status(409).json({ error: "User Already Register." });
            }
    
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);
    
            const newUser = new user({ image: req.file.path, name, email, password: hashedPassword });
            const saveUser = await newUser.save();
    
            if (saveUser) {
                const userResponse = { _id: saveUser._id, image: saveUser.image, name: saveUser.name, email: saveUser.email };
                return res.status(200).json({ message: "User Successful register", status: 200, user: userResponse });
            } else {
                return res.status(404).json({ error: "User Not Found" });
            }
        } catch (error) {
            console.error("Registration error:", error);
            return res.status(500).json({ error: "Something went wrong" });
        }
    },
    

    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(409).json({ error: "Email and Password are required." });
            }
            const userFromDb = await user.findOne({ email });
            if (!userFromDb) {
                return res.status(400).json({ error: "User not found" });
            }
            const isPasswordValid = await bcrypt.compare(password, userFromDb.password);
            if (isPasswordValid) {
                delete userFromDb._doc.password;
                const token = jwt.sign({ user: userFromDb }, jwtKey, { expiresIn: "2h" });
                return res.status(200).json({ message: "Login Successful", status: 200, user: userFromDb, auth: token });
            } else {
                return res.status(400).json({ error: "Wrong Email and Password" });
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Something Went to Wrong" });
        }
    }
}

