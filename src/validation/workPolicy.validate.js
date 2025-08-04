import { array, number, object, string } from "yup";
import dayjs from "dayjs";
import customParseFormat from 'dayjs/plugin/customParseFormat.js';
dayjs.extend(customParseFormat);

// เช็ครูปแบบเวลา
const isValidTime = (value) => {
  return dayjs(value, "HH:mm", true).isValid();
};

// เช็คความต่างเวลา (end ต้องมากกว่า start)
const isAfter = (start, end) => {
  return dayjs(end, 'HH:mm').isAfter(dayjs(start, 'HH:mm'))
}

// Valid working days
const validWorkingDays = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];

const workPolicySchema = {
  createWorkPolicy: object({
    name: string().required("กรุณาใส่ชื่อ นโยบายการทำงาน"),
    startTime: string()
      .required("กรุณาใส่เวลาเริ่มงาน")
      .test("valid-time", "รูปแบบเวลาเริ่มไม่ถูกต้อง", (value) =>
        value ? isValidTime(value) : true
      ),
    endTime: string()
      .required("กรุณาใส่เวลาเลิกงาน")
      .test("valid-time", "รูปแบบเวลาเลิกไม่ถูกต้อง", (value) =>
        value ? isValidTime(value) : true
      )
      .test("is-after", "เวลาเลิกต้องมากกว่าเวลาเริ่ม", function (endTime) {
        const { startTime } = this.parent;
        return !endTime || !startTime || isAfter(startTime, endTime); // ✅ แก้ให้ถูก
      }),
    allowedLateMinutesPerMonth: number()
      .integer("กรุณาใส่จำนวนเต็ม")
      .min(0, "กรุณาใส่จำนวนไม่ติดลบ")
      .required("กรุณาใส่นาทีที่ยอมให้สาย"),
    deductIfLateOver: number()
      .integer("กรุณาใส่จำนวนเต็ม")
      .min(0, "กรุณาใส่จำนวนไม่ติดลบ")
      .default(0),
    minHoursForHalfDay: number()
      .min(0, "กรุณาใส่จำนวนไม่ติดลบ")
      .required("กรุณาใส่จำนวนชั่วโมงขั้นต่ำสำหรับครึ่งวัน"),
    halfDayAbsentRule: number()
      .min(0, "กรุณาใส่จำนวนไม่ติดลบ")
      .required("กรุณาใส่จำนวนวัน"),
    remark: string().optional().default(""),
    workingDays: array()
      .of(
        string().oneOf(validWorkingDays, "วันทำงานไม่ถูกต้อง")
      )
      .min(1, "กรุณาเลือกวันทำงานอย่างน้อย 1 วัน")
      .required("กรุณาเลือกวันทำงาน"),
  }),
  
  updateWorkPolicy: object({
    name: string().optional(),
    startTime: string()
      .optional()
      .test("valid-time", "รูปแบบเวลาเริ่มไม่ถูกต้อง", (value) =>
        !value || isValidTime(value)
      ),
    endTime: string()
      .optional()
      .test("valid-time", "รูปแบบเวลาเลิกไม่ถูกต้อง", (value) =>
        !value || isValidTime(value)
      )
      .test("is-after", "เวลาเลิกต้องมากกว่าเวลาเริ่ม", function (endTime) {
        const { startTime } = this.parent;
        return !endTime || !startTime || isAfter(startTime, endTime);
      }),
    allowedLateMinutesPerMonth: number()
      .optional()
      .integer("กรุณาใส่จำนวนเต็ม")
      .min(0, "กรุณาใส่จำนวนไม่ติดลบ"),
    deductIfLateOver: number()
      .optional()
      .integer("กรุณาใส่จำนวนเต็ม")
      .min(0, "กรุณาใส่จำนวนไม่ติดลบ"),
    minHoursForHalfDay: number()
      .optional()
      .min(0, "กรุณาใส่จำนวนไม่ติดลบ"),
    halfDayAbsentRule: number()
      .optional()
      .min(0, "กรุณาใส่จำนวนไม่ติดลบ"),
    remark: string().optional(),
    workingDays: array()
      .optional()
      .of(
        string().oneOf(validWorkingDays, "วันทำงานไม่ถูกต้อง")
      )
      .min(1, "กรุณาเลือกวันทำงานอย่างน้อย 1 วัน"),
  }),
};

export default workPolicySchema;