// const jwt = require("jsonwebtoken");
// const Student = require("../models/Student");
// const Trainer = require("../models/Trainers");
// const Admin = require("../models/Admins");

// const login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // 1️⃣ Find user by email (any role)
//     let user =
//       (await Admin.findOne({ email })) ||
//       (await Trainer.findOne({ email })) ||
//       (await Student.findOne({ email }));

//     if (!user) {
//       return res.status(401).json({ message: "User not found" });
//     }

//     // 2️⃣ Check password (PLAIN for now)
//     if (user.password !== password) {
//       return res.status(401).json({ message: "Invalid password" });
//     }

//     // 3️⃣ Generate token
//     const token = jwt.sign(
//       {
//         id: user._id,
//         role: user.role,
//         name: user.name,
//       },
//       process.env.JWT_SECRET,
//       { expiresIn: "1d" }
//     );

//     res.json({
//       token,
//       role: user.role,
//       name: user.name,
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// module.exports = { login };

// const jwt = require("jsonwebtoken");
// const Student = require("../models/Student");
// const Trainer = require("../models/Trainers");
// const Admin = require("../models/Admins");

// const login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // 1️⃣ Find user by email (any role)
//     let user =
//       (await Admin.findOne({ email })) ||
//       (await Trainer.findOne({ email })) ||
//       (await Student.findOne({ email }));

//     if (!user) {
//       return res.status(401).json({ message: "User not found" });
//     }

//     // 2️⃣ Check password (PLAIN for now)
//     if (user.password !== password) {
//       return res.status(401).json({ message: "Invalid password" });
//     }

//     // 3️⃣ Generate token ✅ (email added)
//     const token = jwt.sign(
//       {
//         id: user._id,
//         role: user.role,
//         name: user.name,
//         email: user.email, // 👈 ADD THIS
//       },
//       process.env.JWT_SECRET,
//       { expiresIn: "1d" }
//     );

//     res.json({
//       token,
//       role: user.role,
//       name: user.name,
//       email: user.email, // (optional but useful)
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// module.exports = { login };


const jwt = require("jsonwebtoken");
const Student = require("../models/Student");
const Trainer = require("../models/Trainers");
const Admin = require("../models/Admins");

/**
 * LOGIN
 * - Generates access token (short life)
 * - Generates refresh token (long life)
 * - Stores refresh token in DB
 * - Stores refresh token in httpOnly cookie
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user (admin / trainer / student)
    const user =
      (await Admin.findOne({ email })) ||
      (await Trainer.findOne({ email })) ||
      (await Student.findOne({ email }));

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Plain-text password check (same as your current setup)
    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Access Token (short-lived)
    const accessToken = jwt.sign(
      {
        id: user._id,
        role: user.role,
        name: user.name,
        email: user.email,
      },
      process.env.JWT_SECRET, // Akhilesh@123
      { expiresIn: "1m" }
    );

    // Refresh Token (long-lived)
    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.JWT_REFRESH_SECRET, // Sonu@10
      { expiresIn: "10d" }
    );

    // Save refresh token in DB
    user.refreshToken = refreshToken;
    await user.save();

    // Save refresh token in cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    // Send response
    res.json({
      accessToken,
      role: user.role,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * REFRESH ACCESS TOKEN
 * - Reads refresh token from cookie
 * - Verifies it
 * - Issues a new access token
 */
const refresh = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) {
      return res.sendStatus(401);
    }

    // Find user with refresh token
    const user =
      (await Admin.findOne({ refreshToken: token })) ||
      (await Trainer.findOne({ refreshToken: token })) ||
      (await Student.findOne({ refreshToken: token }));

    if (!user) {
      return res.sendStatus(403);
    }

    // Verify refresh token
    jwt.verify(token, process.env.JWT_REFRESH_SECRET);

    // Generate new access token
    const newAccessToken = jwt.sign(
      {
        id: user._id,
        role: user.role,
        name: user.name,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1m" }
    );

    res.json({ accessToken: newAccessToken });
  } catch (error) {
    res.sendStatus(403);
  }
};

module.exports = { login, refresh };