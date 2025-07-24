import { date, number, object, ref, string } from "yup";

const holidaySchema = {
  createOrUpdateHoliday: object({
    date: date().required("กรุณาใส่วันหยุด"),
    name: string().required("กรุณาใส่ชื่อวันหยุด"),
  }),
};

export default holidaySchema;
