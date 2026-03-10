// const jwt = require("jsonwebtoken");

// const verifyToken = (req, res, next) => {
//   try {
//     const authHeader = req.headers.authorization;
//     if (!authHeader) {
//       return res.status(401).json({ message: "No token provided" });
//     }

//     const token = authHeader.split(" ")[1];
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     req.user = decoded; // { name, role, id }
//     next();
//   } catch (error) {
//     res.status(401).json({ message: "Invalid token" });
//   }
// };

// const isAdmin = (req, res, next) => {
//   if (req.user.role === "admin") {
//     next();
//   } else {
//     res.status(403).json({ message: "You don't have access" });
//   }
// };

// module.exports = { verifyToken, isAdmin };

const jwt = require("jsonwebtoken");

// Verify JWT
const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // decoded = { id, name, email, role, iat, exp }
    req.user = decoded;

    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// Admin-only access
const isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "You don't have access" });
  }

  next();
};

module.exports = { verifyToken, isAdmin };
