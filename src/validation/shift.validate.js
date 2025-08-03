import { number, object, string } from "yup";
import dayjs from "dayjs";
import customParseFormat from 'dayjs/plugin/customParseFormat.js';
dayjs.extend(customParseFormat);

const isValidTime = (value) => {
  return dayjs(value, "HH:mm", true).isValid();
};

const isAfter = (start, end) => {
  return dayjs(end, "HH:mm").isAfter(dayjs(start, "HH:mm"));  
};

const shiftSchema = {
  createShift: object({
    name: string().required("กรุณาใส่ชื่อกะ"),
    inTime: string()
      .required("กรุณาใส่เวลาเริ่มงาน")
      .test("valid-time", "รูปแบบเวลาเริ่มไม่ถูกต้อง", (value) =>
        value ? isValidTime(value) : true
      ),
    outTime: string()
      .required("กรุณาใส่เวลาเลิกงาน")
      .test("valid-time", "รูปแบบเวลาเลิกไม่ถูกต้อง", (value) =>
        value ? isValidTime(value) : true
      )
      .test(
        "is-after",
        "เวลาเลิกงานต้องมากกว่าเวลาเริ่มงาน",
        function (outTime) {
          const { inTime } = this.parent;
          return !outTime || !inTime || isAfter(inTime, outTime);
        }
      ),
  }),
  
  updateShift: object({  
    name: string().optional(),
    inTime: string()
      .optional()
      .test("valid-time", "รูปแบบเวลาเริ่มไม่ถูกต้อง", (value) =>
        !value || isValidTime(value)  
      ),
    outTime: string()
      .optional()
      .test("valid-time", "รูปแบบเวลาเลิกไม่ถูกต้อง", (value) =>
        !value || isValidTime(value)
      )
      .test(
        "is-after",
        "เวลาเลิกงานต้องมากกว่าเวลาเริ่มงาน",
        function (outTime) {
          const { inTime } = this.parent;
          return !outTime || !inTime || isAfter(inTime, outTime);
        }
      ),
  }),
};

export default shiftSchema;