import jwt from "jsonwebtoken";

const genTokenJWT = {
  loginToken: (payload) => {
    return jwt.sign(payload, process.env.SECRET_KEY, {
      algorithm: "HS256",
      expiresIn: "15m",
    });
  },
  refreshToken: (payload) => {
    return jwt.sign(payload, process.env.REFRESH_KEY, {
      algorithm: "HS256",
      expiresIn: "30d",
    });
  },
  checkToken: (token) => {
    return jwt.verify(token, process.env.SECRET_KEY, { algorithms: ["HS256"] });
  },
  checkrefreshToken: (token) => {
    return jwt.verify(token, process.env.REFRESH_KEY, {
      algorithms: ["HS256"],
    });
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
