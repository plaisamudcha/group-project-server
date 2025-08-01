import jwt from "jsonwebtoken";
import createError from "./create-error.util.js";

const genTokenJWT = {
  loginToken: (payload) => {
    return jwt.sign(payload, process.env.SECRET_KEY, {
      algorithm: "HS256",
      expiresIn: "1h",
    });
  },
  refreshToken: (payload) => {
    return jwt.sign(payload, process.env.REFRESH_KEY, {
      algorithm: "HS256",
      expiresIn: "30d",
    });
  },
  checkToken: (token) => {
    try {
      return jwt.verify(token, process.env.SECRET_KEY, {
        algorithms: ["HS256"],
      });
    } catch (error) {
      createError(401, "Token is invalid or expired");
    }
  },
  checkrefreshToken: (token) => {
    try {
      return jwt.verify(token, process.env.REFRESH_KEY, {
        algorithms: ["HS256"],
      });
    } catch (error) {
      createError(401, "Refresh token is invalid or expired");
    }
  },
  forgotPasswordToken: (payload) => {
    return jwt.sign(payload, process.env.RESET_KEY, {
      algorithm: "HS256",
      expiresIn: "30m",
    });
  },
  checkResetPasswordToken: (token) => {
    return jwt.verify(token, process.env.RESET_KEY, { algorithms: ["HS256"] });
  },
};

export default genTokenJWT;
