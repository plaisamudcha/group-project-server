import { date, number, object, ref, string } from "yup";
import { LeaveType, StatusLeave } from "../../generated/prisma/client.js";
import dayjs from "dayjs";

const leaveType = Object.values(LeaveType);
const statusType = Object.values(StatusLeave);

const isValidDate = (value, format = "YYYY-MM-DDTHH:mm") => {
  return dayjs(value, format, true).isValid();
};

const isSameOrAfter = (start, end) => {
  return dayjs(end).isAfter(dayjs(start)) || dayjs(end).isSame(dayjs(start))
}

// endDate ต้องไม่เป็นอดีต และ เพิ่มจำกัดความยาวของเหตุผล

const leaveSchema = {
  createLeaveRequest: object({
    startDate: string()
      .required("กรุณาใส่วันลา")
      .nullable()
      .test("valid-format", "รูปแบบวันเริ่มไม่ถูกต้อง ", (value) =>
        value ? isValidDate(value) : true
      ),
    endDate: string()
      .required("กรุณาใส่วันลา")
      .nullable()
      .test("valid-format", "รูปแบบวันสิ้นสุดไม่ถูกต้อง ", (value) =>
        value ? isValidDate(value) : true
      )
      .test("isNotLessthanStartDate", "วันสิ้นสุดต้องไม่น้อยกว่าวันเริ่ม", (value) =>
        value ? isSameOrAfter(value) : true
      ),
    leaveType: string().oneOf(leaveType, "ประเภทการลาไม่ถูกต้อง"),
    status: string().oneOf(statusType, "สถานะลาไม่ถูกต้อง"),
    reason: string().required("กรุณาใส่เหตุผล").max(500, "เหตุผลยาวเกินไป"),
    userId: string().required("กรุณาใส่ ID ของ User"),
  }),
  UpdateLeaveRequest: object({
    startDate: string()
      .nullable()
      .test("valid-format", "รูปแบบวันเริ่มไม่ถูกต้อง ", (value) =>
        value ? isValidDate(value) : true
      ),
    endDate: string()
      .nullable()
      .test("valid-format", "รูปแบบวันสิ้นสุดไม่ถูกต้อง ", (value) =>
        value ? isValidDate(value) : true
      )
      .test("isNotLessthanStartDate", "วันสิ้นสุดต้องไม่น้อยกว่าวันเริ่ม", (value) =>
        value ? isSameOrAfter(value) : true
      ),
    leaveType: string().nullable().oneOf(leaveType, "ประเภทการลาไม่ถูกต้อง"),
    status: string().nullable().oneOf(statusType, "สถานะลาไม่ถูกต้อง"),
    reason: string().nullable().max(500, "เหตุผลยาวเกินไป"),
    userId: string().nullable(),
  }),
};

export default leaveSchema;
