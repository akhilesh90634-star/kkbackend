
// async (req,res)=>{
//     let data=await studentModel.find();
//     res.send(data);
// }

// async (req,res)=>{
//     let data=req.body;//
//     let rev=await studentModel.create(data);
//     console.log(rev);
//     res.send("stored!!");
// }

// async (req, res) => {
//     let name = req.params.name;
//     await studentModel.deleteOne({ name: name });
//     res.send("deleted!!");
// }

// async (req, res) => {
//     let name = req.params.name;
//     let newData = req.body;
//     await studentModel.updateOne({ name: name }, { $set: newData });
//     res.send("updated!!");
// } 

// const studentModel = require("../models/Student");

// // GET all students

// const getStudents = (req, res) => {
//   studentModel
//     .find({}, "name email") // 👈 projection
//     .then((data) => {
//       res.status(200).json(data);
//     })
//     .catch((err) => {
//       res.status(500).json({ error: err.message });
//     });
// };

// // ADD student
// const addStudent = (req, res) => {
//   studentModel
//     .create(req.body)
//     .then((data) => {
//       res.status(201).json({
//         message: "Student added successfully",
//         data,
//       });
//     })
//     .catch((err) => {
//       res.status(400).json({ error: err.message });
//     });
// };

// // DELETE student by name
// const deleteStudent = (req, res) => {
//   studentModel
//     .deleteOne({ name: req.params.name })
//     .then((result) => {
//       if (result.deletedCount === 0) {
//         return res.status(404).json({ message: "Student not found" });
//       }
//       res.status(200).json({ message: "Student deleted" });
//     })
//     .catch((err) => {
//       res.status(500).json({ error: err.message });
//     });
// };

// // UPDATE student by name
// const updateStudent = (req, res) => {
//   studentModel
//     .updateOne(
//       { name: req.params.name },
//       { $set: req.body }
//     )
//     .then((result) => {
//       if (result.matchedCount === 0) {
//         return res.status(404).json({ message: "Student not found" });
//       }
//       res.status(200).json({ message: "Student updated" });
//     })
//     .catch((err) => {
//       res.status(400).json({ error: err.message });
//     });
// };

// module.exports = {
//   getStudents,
//   addStudent,
//   deleteStudent,
//   updateStudent,
// };


const studentModel = require("../models/Student");

// ================= GET ALL STUDENTS =================
const getStudents = async (req, res) => {
  try {
    const students = await studentModel.find({}, "name email");
    res.status(200).json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ================= REGISTER STUDENT =================
const registerStudent = async (req, res) => {
  try {
    const data = req.body;
    data.role = "student";

    await studentModel.create(data);
    res.status(201).json({ message: "Student details stored!!!" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ================= DELETE STUDENT (BY ID) =================
const deleteStudent = async (req, res) => {
  try {
    const deleted = await studentModel.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json({ message: "Student deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ================= UPDATE STUDENT (BY ID) =================
const updateStudent = async (req, res) => {
  try {
    const updated = await studentModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json({ message: "Student updated", updated });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  getStudents,
  registerStudent,
  deleteStudent,
  updateStudent,
};