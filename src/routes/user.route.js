import express from "express";

const userRoute = express.Router();

userRoute.get("/", () => {});
userRoute.get("/:id", () => {});
userRoute.post("/", () => {});
userRoute.put("/:id", () => {});

export default userRoute;
