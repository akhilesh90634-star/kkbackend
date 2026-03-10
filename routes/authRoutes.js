const express = require("express");
const { login, refresh } = require("../controllers/authController");

const router = express.Router();

// login
router.post("/login", login);

// refresh access token
router.post("/refresh", refresh);

module.exports = router;
