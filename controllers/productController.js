const express = require("express");
require("../db/config");
const user = require("../db/user");
const cors = require('cors')
const app = express();
app.use(express.json())
app.use(cors());
const product = require('../db/product');


module.exports = {
    createProduct: async (req, res) => {
        console.log(req.body.ratings)
        try {
            const { name, brand, description, price, currency, availability, category, userId, ratings } = req.body;
            const uploadedFiles = req.files.map(file => ({
                originalname: file.originalname,
                filename: file.filename,
                path: file.path,
            }));

            let errorMessage = "";
            if (!name || !brand || !description || !price || !currency || !availability || !category || !userId) {
                errorMessage = "Missing required fields";
            }

            if (errorMessage !== "") {
                return res.status(400).json({ error: errorMessage });
            }

            const isUser = await user.findOne({ _id: userId });
            if (!isUser) {
                return res.status(404).json({ error: "User not found" });
            }


            const newProduct = new product({
                name,
                brand,
                description,
                price,
                currency,
                availability,
                category,
                userId,
                images: uploadedFiles.map(file => file.path),
                features: JSON.parse(req.body.features),
                ratings: JSON.parse(req.body.ratings)

            });

            const saveProduct = await newProduct.save();
            if (saveProduct) {
                const productResponse = {
                    message: 'Product created successful',
                    status: 200,
                    product: {
                        productId: saveProduct._id,
                        name: saveProduct.name,
                        brand: saveProduct.brand,
                        description: saveProduct.description,
                        price: saveProduct.price,
                        currency: saveProduct.currency,
                        availability: saveProduct.availability,
                        category: saveProduct.category,
                        userId: saveProduct.userId,
                        images: saveProduct.images,
                        features: saveProduct.features,
                        ratings: saveProduct.ratings
                    },
                };

                return res.status(200).json(productResponse);
            } else {
                return res.status(400).json({ error: "Failed to create product" });
            }
        } catch (error) {
            console.error("Product creation error:", error);
            return res.status(500).json({ error: "Something went wrong" });
        }
    },


    productList: async (req, res) => {
        try {
            const { myId } = req.body;
            const result = await product.find({ userId: myId });
            if (result) {
                res.status(200).json({ message: "Product listing", data: result })
            } else {
                res.status(400).json({ error: "User is Not Found" })
            }
        } catch (error) {
            res.status(500).json({ message: "You Want to Something" })
        }
    },

    productDelete: async (req, res) => {
        try {
            const result = await product.deleteOne({ _id: req.params.id });
            if (result) {
                res.status(200).json({ message: "Product Delete Successful." })
            } else {
                res.status(400).json({ error: "Product is Not Found" })
            }
        } catch (error) {
            res.status(500).json({ message: "Something went to wrong" })
        }
    },

    productUpdate: async (req, res) => {
        try {

            const result = await product.updateOne({
                _id: req.params.id
            }, {
                $set: req.body
            });
            if (result) {
                res.status(200).json({ message: "Product Update Successful." })
            } else {
                res.status(400).json({ error: "Product is Not Found" })
            }
        } catch (error) {
            res.status(500).json({ message: "You Want to Something" })
        }
    }
}