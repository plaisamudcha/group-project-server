import { date, number, object, ref, string } from "yup";
import dayjs from "dayjs";
import customParseFormat from 'dayjs/plugin/customParseFormat.js';
dayjs.extend(customParseFormat);

// เช็ครูปแบบเวลา
const isValidTime = (value) => {
  return dayjs(value, "HH:mm", true).isValid();
};

// เช็คความต่างเวลา
const isAfter = (start, end) => {
  return dayjs(end, 'HH:mm').isAfter(dayjs(start, 'HH:mm'))  // แก้เป็น HH:mm
}

const workPolicySchema = {
  createOrUpdateWorkPolicy: object({
    name: string().required("กรุณาใส่ชื่อ นโยบายการทำงาน"),
    startTime: string()
      .required("กรุณาใส่เวลาเริ่มงาน")
      .test("valid-time", "รูปแบบเวลาเริ่มไม่ถูกต้อง", (value) =>
        value ? isValidTime(value) : true
      ),
    endTime: string()
      .required("กรุณาใส่เวลาเลิกงาน")
      .nullable()
      .test("valid-time", "รูปแบบเวลาเลิกไม่ถูกต้อง", (value) =>
        value ? isValidTime(value) : true
      )
      .test("is-after", "เวลาเลิกต้องมากกว่าเวลาเริ่ม", function (endTime) {
        const { startTime } = this.parent;
        return !endTime || !startTime || isAfter(endTime, startTime);
      }),
    allowedLateMinutesPerMonth: number()
      .integer("กรุณาใส่จำนวนเต็ม")
      .min(0, "กรุณาใส่จำนวนไม่ติดลบ")  // เปลี่ยนจาก positive เป็น min(0)
      .required("กรุณาใส่นาทีที่ยอมให้สาย"),
    deductIfLateOver: number()
      .integer("กรุณาใส่จำนวนเต็ม")
      .min(0, "กรุณาใส่จำนวนไม่ติดลบ")
      .required("กรุณาใส่จำนวนเงินที่หัก"),
    halfDayAbsentRule: number()
      .min(0, "กรุณาใส่จำนวนไม่ติดลบ")
      .required("กรุณาใส่จำนวนวัน"),
  }),
  
  UpdateWorkPolicy: object({
    name: string().nullable().optional(),
    startTime: string()
      .nullable()
      .optional()
      .test("valid-time", "รูปแบบเวลาเริ่มไม่ถูกต้อง", (value) =>
        !value || isValidTime(value)  // ถ้าไม่มีค่าให้ผ่าน
      ),
    endTime: string()
      .nullable()
      .optional()
      .test("valid-time", "รูปแบบเวลาเลิกไม่ถูกต้อง", (value) =>
        !value || isValidTime(value)
      )
      .test("is-after", "เวลาเลิกต้องมากกว่าเวลาเริ่ม", function (endTime) {
        const { startTime } = this.parent;
        return !endTime || !startTime || isAfter(startTime, endTime);
      }),
    allowedLateMinutesPerMonth: number()
      .nullable()
      .optional()
      .integer("กรุณาใส่จำนวนเต็ม")
      .min(0, "กรุณาใส่จำนวนไม่ติดลบ"),
    deductIfLateOver: number()
      .nullable()
      .optional()
      .integer("กรุณาใส่จำนวนเต็ม")
      .min(0, "กรุณาใส่จำนวนไม่ติดลบ"),
    halfDayAbsentRule: number()
      .nullable()
      .optional()
      .min(0, "กรุณาใส่จำนวนไม่ติดลบ"),
  }),
};

export default workPolicySchema;