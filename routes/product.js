const {createProduct ,productList} = require("../controllers/productController");

const productRoutes = (app) => {
    app.post("/api/create-product", createProduct)
    app.post("/api/product-list", productList)
}

module.exports = productRoutes;