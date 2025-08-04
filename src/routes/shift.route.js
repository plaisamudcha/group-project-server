import express from "express";
import shiftController from "../controllers/shift.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import validate from "../validation/validate.validate.js";
import shiftSchema from "../validation/shift.validate.js";

const shiftsRoute = express.Router();

shiftsRoute.use(authMiddleware.checkToken);
shiftsRoute.use(authMiddleware.isRole("HR"));

shiftsRoute.get("/", shiftController.getAllshift);
shiftsRoute.post("/",  shiftController.createShift);
shiftsRoute.put("/:id", shiftController.updateShift);
shiftsRoute.post("/assign-employee", shiftController.assignEmployee);
shiftsRoute.post("/remove-employee", shiftController.removeEmployee);
export default shiftsRoute;
