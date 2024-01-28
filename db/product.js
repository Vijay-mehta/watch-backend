const mongoose =require('mongoose');

const productSchema = new mongoose.Schema({
    name:String,
    brand:String,
    description:String,
    price:Number,
    currency:String,
    availability:String,
    category:String,
    userId: mongoose.Schema.ObjectId,
    images: [String],
    features:[String],
    ratings:Object
})

module.exports = mongoose.model("products",productSchema);