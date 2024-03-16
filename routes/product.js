const { createProduct, productList, productDelete, productUpdate } = require("../controllers/productController");
const upload = require("../helper/multiMulter");

const productRoutes = (app) => {
    app.post("/api/create-product", upload.array('images'), createProduct);
    app.get("/api/product-list/:id", productList);
    app.delete("/api/product-delete/:id", productDelete);
    app.put("/api/product-update/:id", upload.array('images'),productUpdate);
};

module.exports = productRoutes;
