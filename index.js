const express = require("express");
const mongoose = require('mongoose');
require("./db/config");
const user = require("./db/user");
const jwt = require('jsonwebtoken');
const jwtKey = 'e-comm';
const bcrypt = require('bcrypt');
const cors = require('cors')
const app = express();
app.use(express.json())
app.use(cors());
const product = require('./db/product')

// <------------------------ Register--------->

app.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        let errorMessage = "";
        if (!name) {
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
            return res.status(409).json({ error: "User Already Register." })
        }
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = new user({ name, email, password: hashedPassword });
        const saveUser = await newUser.save();
        if (saveUser) {
            const userResponse = { _id: saveUser._id, name: saveUser.name, email: saveUser.email };
            return res.status(200).json({ message: "User Successful register", status: 200, user: userResponse });

        } else {
            return res.status(404).json({ error: "User Not Found" })
        }
    } catch (error) {
        console.error("Registration error:", error);
        return res.status(500).json({ error: "Something went to wrong" });
    }
})

// <------------------------ Login--------->

app.post("/login", async (req, res) => {
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
        return res.status(500).json({ error: "Something Went Wrong" });
    }
});

// <------------------------ Create Product--------->

app.post('/create-product', async (req, res) => {
    try {
        const { name, brand, price, category,userId } = req.body;
        let errorMessage = "";
        if (!name) {
            errorMessage = "Missing 'name' field";
        } else if (!brand) {
            errorMessage = "Missing 'brand' field";
        } else if (!price) {
            errorMessage = "Missing 'price' field";
        } else if (!category) {
            errorMessage = "Missing 'category' field";
        }
        else if (!category) {
            errorMessage = "Missing 'userId' field";
        }
        if (errorMessage !== "") {
            return res.status(409).json({ error: errorMessage });
        }
        const newResult = new product({ name, brand, price, category,userId });
        const saveProduct = await newResult.save();
        if (saveProduct) {
            return res.status(200).json({ message: 'Product created successful', product: saveProduct })

        } else {
            return res.status(400).json({ error: "Wrong product name" });
        }
    } catch (error) {
        console.error("Registration error:", error);
        return res.status(500).json({ error: "Something went to wrong" });
    }
})

app.listen(8000);