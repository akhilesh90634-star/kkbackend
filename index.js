// let express = require("express")
// //we will now import mongoose it is a data base integration library used to integrate our database
// let mongoose = require("mongoose")

// let app = express();
// app.use(express.json());//it is a middleware used for the body which is coming from the front-end and we will convert that body to the json

// app.listen(5000,()=>{
//     console.log("server is running in prt 5000");
// })

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const connectdb = require("./config/db");

const app = express();

// 🔹 CORS (IMPORTANT for refresh token cookies)
app.use(
  cors({
    origin: "http://localhost:3000", // change if frontend URL is different
    credentials: true, // 🔥 REQUIRED for cookies
  })
);

// 🔹 Middleware
app.use(express.json());
app.use(cookieParser());

// 🔹 Database connection
connectdb();

// 🔹 Routes
app.use("/students", require("./routes/studentRoutes"));
app.use("/trainers", require("./routes/trainerRoutes"));
app.use("/auth", require("./routes/authRoutes"));

// 🔹 Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});