const {createProduct ,productList,productDelete,productUpdate} = require("../controllers/productController");

const productRoutes = (app) => {
    app.post("/api/create-product", createProduct)
    app.post("/api/product-list", productList)
    app.delete("/api/product-delete/:id", productDelete)
    app.put("/api/product-update/:id", productUpdate)
}

module.exports = productRoutes;