import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import holidayController from "../controllers/holiday.controller.js";

const holidayRoute = express.Router();

holidayRoute.use(authMiddleware.checkToken)

holidayRoute.get("/", holidayController.getHoliday);
holidayRoute.post("/", authMiddleware.isRole('HR'), holidayController.createHoliday);
holidayRoute.put("/:id", authMiddleware.isRole('HR'), holidayController.editHoliday);
holidayRoute.delete("/:id", authMiddleware.isRole('HR'), holidayController.deleteHoliday);

export default holidayRoute;