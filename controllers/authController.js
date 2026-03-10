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
const Customer = require("../models/Customer");
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

    // Find user (admin / customer)
    const user =
      (await Admin.findOne({ email })) ||
      (await Customer.findOne({ email }));

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Password check
    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Access Token
    const accessToken = jwt.sign(
      {
        id: user._id,
        role: user.role,
        name: user.name,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1m" }
    );

    // Refresh Token
    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "10d" }
    );

    // Save refresh token
    user.refreshToken = refreshToken;
    await user.save();

    // Store cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

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
      (await Customer.findOne({ refreshToken: token }));

    if (!user) {
      return res.sendStatus(403);
    }

    jwt.verify(token, process.env.JWT_REFRESH_SECRET);

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