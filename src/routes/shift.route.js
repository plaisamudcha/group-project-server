import express from "express";
import shiftController from "../controllers/shift.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import validate from "../validation/validate.validate.js";
import shiftSchema from "../validation/shift.validate.js";

const shiftsRoute = express.Router();

shiftsRoute.use(authMiddleware.checkToken);
shiftsRoute.use(authMiddleware.isRole("HR"));

shiftsRoute.get("/", shiftController.getAllshift);
shiftsRoute.post("/", validate(shiftSchema.createShift), shiftController.createShift);
shiftsRoute.put("/:id", validate(shiftSchema.updateShift), shiftController.updateShift);

export default shiftsRoute;
