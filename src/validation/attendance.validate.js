import { date, number, object, ref, string } from "yup";
import { StatusType } from "../../generated/prisma/client.js";

const statusType = Object.values(StatusType);

//เพิ่ม ClockIn ClockOut (ต้องเป็นเวลาที่มากกว่าตอนเข้า) ShiftId เผื่อเอาไว้ตอนจะ Patch แล้วต้องเช็ค Datatype ดักไว้ก่อน

const attendanceSchema = {
  createOrUpdateAttendance: object({
    date: date()
      .nullable()
      .transform((value, originalValue) =>
        originalValue === "" ? null : new Date(originalValue)
      )
      .typeError("กรุณากรอกวันที่ให้ถูกต้อง") 
      .required("กรุณาใส่วันทำงาน"),
    clockIn: date()
      .nullable()
      .transform((value, originalValue) =>
        originalValue === "" ? null : new Date(originalValue)
      )
      .typeError("กรุณากรอกวันที่ให้ถูกต้อง"),
    clockOut: date()
      .nullable()
      .test("is-after", "เวลาออกต้องมากกว่าเวลาเข้า", function (clockOut) {
        const { clockIn } = this.parent;
        return !clockOut || !clockIn || clockOut > clockIn;
      })
      .transform((value, originalValue) =>
        originalValue === "" ? null : new Date(originalValue)
      )
      .typeError("กรุณากรอกวันที่ให้ถูกต้อง"),
    status: string().oneOf(statusType, "status ไม่ถูกต้อง"),
    workPolicyId: number()
      .integer("กรุณาใส่จำนวนเต็มบวก")
      .positive("กรุณาใส่จำนวนเต็มบวก")
      .required("กรุณาใส่ workpolicy"),
    shiftId: number().nullable(),
  })
};

export default attendanceSchema;
