import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import holidayController from "../controllers/holiday.controller.js";

const holidayRoute = express.Router();

holidayRoute.use(authMiddleware.checkToken)

holidayRoute.get("/",authMiddleware.isRole('HR'), holidayController.createHoliday);
holidayRoute.post("/", () => {});

export default holidayRoute;
