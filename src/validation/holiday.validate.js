import { date, number, object, ref, string } from "yup";

const holidaySchema = {
  createOrUpdateHoliday: object({
    date: date()
      .nullable()
      .transform((value, originalValue) =>
        originalValue === "" ? null : new Date(originalValue)
      )
      .typeError("กรุณากรอกวันที่ให้ถูกต้อง") 
      .required("กรุณาใส่วันหยุด"),
    name: string().required("กรุณาใส่ชื่อวันหยุด"),
  }),
};

export default holidaySchema;
