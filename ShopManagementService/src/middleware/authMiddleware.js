// import jwt from "jsonwebtoken";

// export const protect = (req, res, next) => {
//   let token = req.headers.authorization;

//   if (token && token.startsWith("Bearer")) {
//     try {
//       token = token.split(" ")[1];
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);
//       req.user = decoded; // { id, role, ... }
//       next();
//     } catch (error) {
//       res.status(401).json({ message: "Not authorized, token failed" });
//     }
//   } else {
//     res.status(401).json({ message: "No token, authorization denied" });
//   }
// };

// // Shop එකකට පමණක් අවසර ලබා දීම
// export const authorizeShop = (req, res, next) => {
//   if (req.user && req.user.role === "shop") {
//     next();
//   } else {
//     res.status(403).json({ message: "Access denied. Only shops can perform this action." });
//   }
// };

// 

import jwt from "jsonwebtoken";

// 1. JWT Authentication
export const protect = (req, res, next) => {
  let token = req.headers.authorization;

  if (token && token.startsWith("Bearer")) {
    try {
      token = token.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret_key");
      req.user = decoded.user; // { id, role, ... } from Auth Service
      next();
    } catch (error) {
      console.error("JWT Verification Error:", error.message);
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    res.status(401).json({ message: "No token, authorization denied" });
  }
};

// 2. Authorization Middleware 
export const authorizeShop = (req, res, next) => {
  if (req.user && req.user.role === "shop") {
    next();
  } else {
    res.status(403).json({ message: "Access denied. Only shops can perform this action." });
  }
};