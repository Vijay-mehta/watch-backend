const express = require("express");
require("../db/config");
const user = require("../db/user");
const cors = require('cors')
const app = express();
app.use(express.json())
app.use(cors());
const product = require('../db/product');


module.exports ={
    productSearch:async(req,res)=>{
        try{
            const result = await product.find({
               "$or":[
                {name:{$regex:req.params.key}}
               ]
            });
            if(result){
                res.status(200).json({message:"Product Successful search.",result})
            }else{
                res.status(400).json({error:"Product is Not Found"})
            }
        }catch(error){
            res.status(500).json({message:"You Want to Something"})
        }
    

    }
}