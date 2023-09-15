const { register, login } = require("../controllers/authController");

const authRoutes = (app) => {
    app.post("/api/register", register)
    app.post("/api/login", login)
}

module.exports = authRoutes;