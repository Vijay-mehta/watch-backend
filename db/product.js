const mongoose =require('mongoose');

const productSchema = new mongoose.Schema({
    name:String,
    brand:String,
    price:Number,
    category:String,
    userId: mongoose.Schema.ObjectId
})

module.exports = mongoose.model("products",productSchema);