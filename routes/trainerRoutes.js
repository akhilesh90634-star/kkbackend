const express = require("express");
const router = express.Router();

const {
  getTrainers,
  getTrainerById,
  registerTrainer,
  updateTrainer,
  deleteTrainer,
} = require("../controllers/trainerControllers");

const { verifyToken, isAdmin } = require("../middlewares/authMiddleware");

// ADMIN ONLY
router.post("/register", verifyToken, isAdmin, registerTrainer);
router.get("/", verifyToken, isAdmin, getTrainers);
router.get("/:id", verifyToken, isAdmin, getTrainerById);
router.put("/:id", verifyToken, isAdmin, updateTrainer);
router.delete("/:id", verifyToken, isAdmin, deleteTrainer);

module.exports = router;
