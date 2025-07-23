import createError from "../utils/create-error.util.js";
import genTokenJWT from "../utils/jwt.util.js";

const authMiddleware = {
  checkToken: (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) createError(401, "Token is missing");

      const token = authHeader.split(" ")[1];
      console.log('token', token)
      const payload = genTokenJWT.checkToken(token);
      console.log('payload', payload)
      req.user = payload;
      next();
    } catch (err) {
      next(err);
    }
  },
  isRole: (role) => (req, res, next) => {
    try {
      if (!role.includes(req.user.role)) createError(401, "Invalid role");
      next();
    } catch (err) {
      next(err);
    }
  },
};

export default authMiddleware;
