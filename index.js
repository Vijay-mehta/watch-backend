const express = require("express");
const cors = require('cors')
const app = express();
app.use(express.json())
app.use(cors());
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/product");
const searchRout = require("./routes/search");

// <------------------------ auth--------->
authRoutes(app);

// <------------------------  Product--------->

productRoutes(app);


searchRout(app);

// ---------- port-------------->
app.listen(8000, () => {
    console.log("Port Listening at :- http://localhost:8000")
});

module.exports = app;