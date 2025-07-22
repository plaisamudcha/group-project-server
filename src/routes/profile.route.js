import express from "express";

const profileRoute = express.Router();

profileRoute.get("/:userId", () => {});
profileRoute.put("/:userId", () => {});

export default profileRoute;
