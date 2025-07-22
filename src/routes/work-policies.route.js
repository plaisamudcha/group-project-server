import express from "express";

const workPolicyRoute = express.Router();

workPolicyRoute.get("/", () => {});
workPolicyRoute.post("/", () => {});
workPolicyRoute.put("/:id", () => {});

export default workPolicyRoute;
