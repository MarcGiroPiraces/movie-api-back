const express = require("express");
const { loginUser, loadUser } = require("../controllers/userController");
const auth = require("../middlewares/auth");

const router = express.Router();

router.post("/login", loginUser);
router.get("/load-user", auth, loadUser);

module.exports = router;
