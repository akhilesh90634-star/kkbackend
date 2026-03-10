const Trainer = require("../models/Trainers");

// GET all trainers (ADMIN)
const getTrainers = async (req, res) => {
  try {
    const trainers = await Trainer.find();
    res.json(trainers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET single trainer
const getTrainerById = async (req, res) => {
  try {
    const trainer = await Trainer.findById(req.params.id);
    if (!trainer) {
      return res.status(404).json({ message: "Trainer not found" });
    }
    res.json(trainer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// REGISTER trainer (ADMIN)
const registerTrainer = async (req, res) => {
  try {
    const data = req.body;
    data.role = "trainer";
    await Trainer.create(data);
    res.status(201).json({ message: "Trainer registered successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// UPDATE trainer
const updateTrainer = async (req, res) => {
  try {
    const updated = await Trainer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Trainer not found" });
    }

    res.json({ message: "Trainer updated successfully", updated });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE trainer
const deleteTrainer = async (req, res) => {
  try {
    const deleted = await Trainer.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Trainer not found" });
    }
    res.json({ message: "Trainer deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getTrainers,
  getTrainerById,
  registerTrainer,
  updateTrainer,
  deleteTrainer,
};