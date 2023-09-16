const express = require("express");
require("../db/config");
const user = require("../db/user");
const cors = require('cors')
const app = express();
app.use(express.json())
app.use(cors());
const product = require('../db/product');




module.exports={
    createProduct:async(req,res)=>{
        try {
            const { name, brand, price, category, userId } = req.body;
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
            else if (!userId) {
                errorMessage = "Missing 'userId' field";
            }
            if (errorMessage !== "") {
                return res.status(409).json({ error: errorMessage });
            }
    
            const isUser = await user.findOne({ _id: userId });
            if (!isUser) {
                return res.status(404).json({ error: "User not found" });
            }
            const newResult = new product({ name, brand, price, category, userId });
            const saveProduct = await newResult.save();
            if (saveProduct) {
                return res.status(200).json({ message: 'Product created successful', status: 200, product: saveProduct })
    
            } else {
                return res.status(400).json({ error: "Wrong product name" });
            }
        } catch (error) {
            console.error("Registration error:", error);
            return res.status(500).json({ error: "Something went to wrong" });
        }
    },

    productList:async(req,res)=>{
        try{
            const {myId} = req.body; 
            console.log("myId", myId)
            const result = await product.find({userId: myId});
            if(result){
                res.status(200).json({message:"Product listing",data:result})
            }else{
                res.status(400).json({error:"User is Not Found"})
            }
        }catch(error){
            res.status(500).json({message:"You Want to Something"})
        }
    }
}