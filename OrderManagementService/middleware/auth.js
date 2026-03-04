import jwt from "jsonwebtoken";

const authUser = (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
      return res.status(401).json({ success: false, message: "Not Authorized. Login Again." });
    }
    const token_decode = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = token_decode.id;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: "Invalid Token. Login Again." });
  }
};

export default authUser;
