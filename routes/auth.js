const { register, login } = require("../controllers/authController");
const upload = require("../helper/mulert");

const authRoutes = (app) => {
    app.post('/api/register', upload.single('image'), register);
    app.post("/api/login", login)
}

module.exports = authRoutes;