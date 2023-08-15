const express =require("express");
const mongoose =require('mongoose');
require("./db/config");
const user =require("./db/user");
const jwt =require('jsonwebtoken');
const jwtKey ='e-comm';
const app =express();
app.use(express.json())

app.post("/register",async(req,res)=>{
    try{
        const{name,email,password} =req.body;
        const userExists = await user.findOne({email});
        if(!name || !email || !password){
            return res.status(400).json({error:"Email And Password are required."})
        }
        if(userExists){
            return res.status(409).json({error:"User Already Register."})
        }
        const newUser = new user({name,email,password});
        const saveUser =await newUser.save();
        if(saveUser){
            return res.status(200).json({message:"User Successful register",user:saveUser});

        }else{
            return res.status(404).json({error:"User Not Found"})
        }
    }catch(error){
        console.error("Registration error:", error);
        return res.status(500).json({error:"Something went to wrong"});
    }
})

app.post("/login",async(req,res)=>{
    try{
        const{email,password} =req.body;
        if(!email || !password){
            return res.status(409).json({errro:"Email and Password are required."})
        }
        const result = await user.findOne({email,password})
        if(result){
            const token = jwt.sign({user:result},jwtKey,{expiresIn:"2h"})
            return res.status(200).json({message:"Login Successful",user:result,auth:token})
        }else{
            return res.status(400).json({error:"Wrong Email and Password"})
        }
    }catch(error){
return res.status(500).json({errro:"Something Went To Wrong"})
    }
})

app.listen(8000);