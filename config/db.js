// let mongoose=require("mongoose");

// mongoose.connect("mongodb+srv://akhilesh90634_db_user:akhilesh10@cluster0.m61najl.mongodb.net/College?appName=Cluster0")
// .then(()=>{
//     console.log('database connected');
// })
// .catch(()=>{
//     console.log('error');
// })

const mongoose = require("mongoose");

const connectDB = () => {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("✅ Database connected");
    })
    .catch((err) => {
      console.error("❌ Database connection failed");
      console.error(err.message);
      process.exit(1);
    });
};

module.exports = connectDB;