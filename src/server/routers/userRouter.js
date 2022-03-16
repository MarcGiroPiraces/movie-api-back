const express = require("express");
const {
  loginUser,
  loadUser,
  createUser,
} = require("../controllers/userController");
const auth = require("../middlewares/auth");

const router = express.Router();

router.post("/register", createUser);
router.post("/login", loginUser);
router.get("/load-user", auth, loadUser);

module.exports = router;
