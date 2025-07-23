import express from "express";
import shiftController from "../controllers/shift.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const shiftsRoute = express.Router();

shiftsRoute.use(authMiddleware.checkToken);
shiftsRoute.use(authMiddleware.isRole("HR"));

shiftsRoute.get("/", shiftController.getAllshift);
shiftsRoute.post("/", shiftController.createShift);
shiftsRoute.put("/:id", shiftController.updateShift);

export default shiftsRoute;
