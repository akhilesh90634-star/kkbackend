
// //schema we define schema before creating the Model which is collection in the Mongodb
// let studentSchema=mongoose.Schema({
//     name:String,
//     age:Number
// })

// // model --> student (collection)

// let studentModel=mongoose.model("students", studentSchema);

const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "customer", // ✅ AUTO role
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

module.exports = mongoose.model("customers", customerSchema);