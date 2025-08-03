import { date, number, object, ref, string } from "yup";
import dayjs from "dayjs";
import customParseFormat from 'dayjs/plugin/customParseFormat.js';
dayjs.extend(customParseFormat);

// ตรวจสอบรูปแบบวันที่ และตรวจจับเงื่อนไขไม่ให้สร้างหรือแก้ไขวันหยุดที่เป็นของปีที่แล้ว

const isValidDate = (value, format = "YYYY-MM-DD") => {
  return dayjs(value, format, true).isValid();
};

const isThisYearOrAfter = (value) => {
  return dayjs(value).year() >= dayjs().year()
}


const holidaySchema = {
  createHoliday: object({
    date: string()
      .required("กรุณาใส่วันหยุด")
      .test("valid-format", "รูปแบบวันหยุดไม่ถูกต้อง", (value) =>
        !value || isValidDate(value)
      ).test("isYearAgo", "กรุณาตรวจสอบปี (ต้องเป็นปีปัจุบันหรือปีหน้า)", (value) =>
        !value || isThisYearOrAfter(value)
      ),
    name: string().required("กรุณาใส่ชื่อวันหยุด"),
  }),
  updateHoliday: object({
    date: string()
      .optional()
      .test("valid-format", "รูปแบบวันหยุดไม่ถูกต้อง", (value) =>
        !value || isValidDate(value)
      ).test("isYearAgo", "กรุณาตรวจสอบปี (ต้องเป็นปีปัจุบันหรือปีหน้า)", (value) =>
        !value || isThisYearOrAfter(value) 
      ),
    name: string().optional(),
  }),
};

export default holidaySchema;
