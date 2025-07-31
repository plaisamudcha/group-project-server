import { date, number, object, ref, string } from "yup";
import { StatusType } from "../../generated/prisma/client.js";
import dayjs from "dayjs";

const statusType = Object.values(StatusType);

//เช็ครูปแบบวันที่
const isValidDate = (value, format = "YYYY-MM-DD") => {
  return dayjs(value, format, true).isValid();
};

//เช็ครูปแบบเวลา
const isValidTime = (value) => {
  return dayjs(value, "HH:mm", true).isValid();
};

//เช็คความต่างเวลา
const isAfter = (start, end) => {
  return dayjs(end, 'HH-mm').isAfter(dayjs(start, 'HH-mm'))
}

//ยังไม่ได้ใช่อ่าหืออๆ T_T
//เพิ่ม ClockIn ClockOut (ต้องเป็นเวลาที่มากกว่าตอนเข้า) ShiftId เผื่อเอาไว้ตอนจะ Patch แล้วต้องเช็ค Datatype ดักไว้ก่อน

const attendanceSchema = {
  createAttendance: object({
    date: string()
      .required("กรุณากรอกวันที่")
      .nullable()
      .test("valid-format", "รูปแบบวันเริ่มไม่ถูกต้อง ", (value) =>
        value ? isValidDate(value) : null
      ).test("is-today", "วันที่ไม่เป็นปัจจุบัน", (value) =>
        value ? dayjs(value).isSame(dayjs()) : null
      ),
    clockIn: string()
      .nullable()
      .test("valid-time", "รูปแบบเวลาไม่ถูกต้อง", (value) =>
        value ? isValidTime(value) : null
      ),
    clockOut: date()
      .nullable()
      .test("valid-time", "รูปแบบเวลาไม่ถูกต้อง", (value) =>
        value ? isValidTime(value) : null
      )
      .test("is-after", "เวลาออกต้องมากกว่าเวลาเข้า", (clockOut) => {
        const { clockIn } = this.parent;
        return !clockOut || !clockIn || isAfter(clockIn, clockOut);
      }),
    status: string().oneOf(statusType, "status ไม่ถูกต้อง"),
    workPolicyId: number()
      .integer("กรุณาใส่จำนวนเต็มบวก")
      .positive("กรุณาใส่จำนวนเต็มบวก")
      .required("กรุณาใส่ workpolicy"),
    shiftId: number().nullable(),
  }),
  UpdateAttendance: object({
    date: string()
      .nullable()
      .test("valid-format", "รูปแบบวันเริ่มไม่ถูกต้อง ", (value) =>
        value ? isValidDate(value) : null
      ).test("is-today", "วันที่ไม่เป็นปัจจุบัน", (value) =>
        value ? dayjs(value).isSame(dayjs()) : null
      ),
    clockIn: string()
      .nullable()
      .test("valid-time", "รูปแบบเวลาไม่ถูกต้อง", (value) =>
        value ? isValidTime(value) : null
      ),
    clockOut: date()
      .nullable()
      .test("valid-time", "รูปแบบเวลาไม่ถูกต้อง", (value) =>
        value ? isValidTime(value) : null
      )
      .test("is-after", "เวลาออกต้องมากกว่าเวลาเข้า", (clockOut) => {
        const { clockIn } = this.parent;
        return !clockOut || !clockIn || isAfter(clockIn, clockOut);
      }),
    status: string().oneOf(statusType, "status ไม่ถูกต้อง"),
    workPolicyId: number()
      .integer("กรุณาใส่จำนวนเต็มบวก")
      .positive("กรุณาใส่จำนวนเต็มบวก"),
    shiftId: number().nullable(),
  })
};

export default attendanceSchema;
