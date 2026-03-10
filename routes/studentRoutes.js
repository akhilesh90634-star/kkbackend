
// //Routes

// app.get("/students",);

// app.post("/students",);

// app.delete("/students/:name", );

// app.put("/students/:name", );


// const express = require("express");
// const router = express.Router();

// const {
//   getStudents,
//   addStudent,
//   deleteStudent,
//   updateStudent,
// } = require("../controllers/studentControllers");

// // routes
// router.get("/students", getStudents);
// router.post("/students", addStudent);
// router.delete("/students/:name", deleteStudent);
// router.put("/students/:name", updateStudent);

// module.exports = router;


// const express = require("express");
// const router = express.Router();

// const {
//   getStudents,
//   addStudent,
//   deleteStudent,
//   updateStudent,
// } = require("../controllers/studentControllers");

// // routes
// router
//   .route("/students")
//   .get(getStudents)
//   .post(addStudent);

// router
//   .route("/students/:name")
//   .delete(deleteStudent)
//   .put(updateStudent);

// // router
// //   .route

// module.exports = router;


const express = require("express");
const router = express.Router();

const {
  getStudents,
  registerStudent,
  deleteStudent,
  updateStudent,
} = require("../controllers/studentControllers");

// PUBLIC: student registration
router.post("/register", registerStudent);

// ADMIN / PROTECTED (recommended)
router.get("/", getStudents);
router.delete("/:id", deleteStudent);
router.put("/:id", updateStudent);

module.exports = router;