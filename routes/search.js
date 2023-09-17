const { productSearch } = require("../controllers/serachController");


const searchRout=(app)=>{

    app.get("/api/search/:key",productSearch)
}

module.exports =searchRout;