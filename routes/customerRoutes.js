const express = require("express");
const router = express.Router();

const {
  getCustomers,
  registerCustomer,
  deleteCustomer,
  updateCustomer,
} = require("../controllers/customerControllers");

const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

// PUBLIC
router.post("/register", registerCustomer);

// ADMIN ONLY
router.get("/", verifyToken, isAdmin, getCustomers);
router.delete("/:id", verifyToken, isAdmin, deleteCustomer);
router.put("/:id", verifyToken, isAdmin, updateCustomer);

module.exports = router;