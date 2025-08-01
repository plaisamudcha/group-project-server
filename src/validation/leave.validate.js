import { date, object, ref, string } from "yup";
import { LeaveType, StatusLeave } from "../../generated/prisma/client.js";
import dayjs from "dayjs";

const leaveType = Object.values(LeaveType);
const statusType = Object.values(StatusLeave);

// ฟังก์ชันสำหรับตรวจสอบ format ของวันที่
const isValidDate = (value, format = "YYYY-MM-DDTHH:mm") => {
  return dayjs(value, format, true).isValid();
};

// ฟังก์ชันสำหรับเช็คว่าวันสิ้นสุด (end) มากกว่าหรือเท่ากับวันเริ่มต้น (start)
const isSameOrAfter = (start, end) => {
  if (!start || !end) return true; // ถ้าไม่มีค่าไหนเลย ให้ผ่านไปก่อน
  return dayjs(end).isSame(dayjs(start)) || dayjs(end).isAfter(dayjs(start));
};

const leaveSchema = {
  createLeaveRequest: object({
    startDate: string()
      .required("กรุณาใส่วันลา")
      .test("valid-format", "รูปแบบวันเริ่มไม่ถูกต้อง", (value) =>
        isValidDate(value)
      ),

    endDate: string()
      .required("กรุณาใส่วันลา")
      .test("valid-format", "รูปแบบวันสิ้นสุดไม่ถูกต้อง", (value) =>
        isValidDate(value)
      )
      // เพิ่ม: ตรวจสอบว่าวันสิ้นสุดไม่เป็นอดีต (ต้องเป็นวันปัจจุบันหรืออนาคต)
      .test(
        "is-not-past",
        "วันสิ้นสุดต้องไม่เป็นวันในอดีต",
        (value) => {
            if (!value) return true;
            return dayjs(value).isSameOrAfter(dayjs(), 'day');
        }
      )
      // แก้ไข: การเปรียบเทียบกับ startDate
      .test(
        "is-not-less-than-start-date",
        "วันสิ้นสุดต้องไม่น้อยกว่าวันเริ่ม",
        function (value) {
          // 'this.parent.startDate' คือการอ้างอิงถึงค่า startDate ใน object เดียวกัน
          return isSameOrAfter(this.parent.startDate, value);
        }
      ),

    leaveType: string().required("กรุณาเลือกประเภทการลา").oneOf(leaveType, "ประเภทการลาไม่ถูกต้อง"),

    reason: string().required("กรุณาใส่เหตุผล").max(500, "เหตุผลยาวเกินไป (สูงสุด 500 ตัวอักษร)"),

    userId: string().required("กรุณาใส่ ID ของ User"),
  }),

  UpdateLeaveRequest: object({
    startDate: string()
      .nullable()
      .test("valid-format", "รูปแบบวันเริ่มไม่ถูกต้อง", (value) =>
        value ? isValidDate(value) : true
      ),

    endDate: string()
      .nullable()
      .test("valid-format", "รูปแบบวันสิ้นสุดไม่ถูกต้อง", (value) =>
        value ? isValidDate(value) : true
      )
      // เพิ่ม: ตรวจสอบว่าวันสิ้นสุดไม่เป็นอดีต
      .test(
        "is-not-past",
        "วันสิ้นสุดต้องไม่เป็นวันในอดีต",
        (value) => {
            if (!value) return true;
            return dayjs(value).isSameOrAfter(dayjs(), 'day');
        }
      )
      // แก้ไข Bug: ใช้ ref() เพื่ออ้างอิงถึง startDate แม้ว่าจะไม่ได้ส่งมาพร้อมกัน
      .test(
        "is-not-less-than-start-date",
        "วันสิ้นสุดต้องไม่น้อยกว่าวันเริ่ม",
        function (value) {
          // ref('startDate') จะดึงค่าของ startDate ใน payload มาเปรียบเทียบ
          const startDate = this.resolve(ref('startDate'));
          return isSameOrAfter(startDate, value);
        }
      ),

    leaveType: string().nullable().oneOf(leaveType, "ประเภทการลาไม่ถูกต้อง"),
    status: string().nullable().oneOf(statusType, "สถานะลาไม่ถูกต้อง"),
    reason: string().nullable().max(500, "เหตุผลยาวเกินไป (สูงสุด 500 ตัวอักษร)"),
    userId: string().nullable(),
  }),
};

export default leaveSchema;