import express from "express";

const authRoute = express.Router();

authRoute.post("/login", () => {});
authRoute.post("/register", () => {});
authRoute.get("/me", () => {});
authRoute.post("/logout", () => {});

export default authRoute;
