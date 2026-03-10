const mongoose = require("mongoose");

// schema
const trainerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    refreshToken: {
    type: String,
    default: null,
  },
  },
  {
    timestamps: true,
  }
);

// model (collection: students)
const trainerModel = mongoose.model("trainer", trainerSchema);

module.exports = trainerModel;
