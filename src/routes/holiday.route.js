import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import holidayController from "../controllers/holiday.controller.js";
import validate from "../validation/validate.validate.js";
import holidaySchema from "../validation/holiday.validate.js";

const holidayRoute = express.Router();

holidayRoute.use(authMiddleware.checkToken)

holidayRoute.get("/", holidayController.getHoliday);
holidayRoute.post("/", authMiddleware.isRole('HR'), validate(holidaySchema.createHoliday), holidayController.createHoliday);
holidayRoute.put("/:id", authMiddleware.isRole('HR'), validate(holidaySchema.updateHoliday), holidayController.editHoliday);
holidayRoute.delete("/:id", authMiddleware.isRole('HR'), holidayController.deleteHoliday);

export default holidayRoute;