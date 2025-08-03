import { date, number, object, ref, string } from "yup";
import { LeaveType, StatusLeave } from "../../generated/prisma/client.js";
import dayjs from "dayjs";
import customParseFormat from 'dayjs/plugin/customParseFormat.js';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter.js';

dayjs.extend(customParseFormat);
dayjs.extend(isSameOrAfter);

const leaveType = Object.values(LeaveType);
const statusType = Object.values(StatusLeave);

const isValidDate = (value, format = "YYYY-MM-DDTHH:mm") => {
  return dayjs(value, format, true).isValid();
};

const checkLenghtDate = (start, end) => {
  return dayjs(end).isSameOrAfter(dayjs(start));
};

// endDate ต้องไม่เป็นอดีต และ เพิ่มจำกัดความยาวของเหตุผล

const leaveSchema = {
  createLeaveRequest: object({
    startDate: string()
      .required("กรุณาใส่วันเริ่มลา")
      .test("valid-format", "รูปแบบวันเริ่มไม่ถูกต้อง ", (value) =>
        !value || isValidDate(value)
      ),
    endDate: string()
      .required("กรุณาใส่วันสิ้นสุดลา")
      .test("valid-format", "รูปแบบวันสิ้นสุดไม่ถูกต้อง ", (value) =>
        !value || isValidDate(value)
      )
      .test(
        "isNotLessthanStartDate",
        "วันสิ้นสุดต้องไม่น้อยกว่าวันเริ่ม",
        function (endDate) {
          const { startDate } = this.parent;
          return !endDate || !startDate || checkLenghtDate(startDate, endDate);
        }
      ),
    leaveType: string()
      .required("กรุณาเลือกประเภทการลา")
      .oneOf(leaveType, "ประเภทการลาไม่ถูกต้อง"),
    // status: string()
    //   .optional()
    //   .oneOf(statusType, "สถานะลาไม่ถูกต้อง"),
    reason: string()
      .required('กรุณาใส่เหตุผล')
      .max(500, "เหตุผลยาวเกินไป"),
    // userId: number()
    //   .required("กรุณาใส่ user ID")
    //   .integer("กรุณาใส่จำนวนเต็ม")
    //   .min(0, "กรุณาใส่จำนวนเต็มบวก"),
  }),

  updateLeaveStatus: object({  // เพิ่ม schema สำหรับ update status
    status: string()
      .oneOf(["APPROVED", "REJECTED"], "สถานะไม่ถูกต้อง")
      .required("กรุณาใส่สถานะ"),
  }),
  
  updateLeaveRequest: object({
    startDate: string()
      .optional()
      .test("valid-format", "รูปแบบวันเริ่มไม่ถูกต้อง ", (value) =>
        !value || isValidDate(value)
      ),
    endDate: string()
      .optional()
      .test("valid-format", "รูปแบบวันสิ้นสุดไม่ถูกต้อง ", (value) =>
        !value || isValidDate(value)
      )
      .test(
        "isNotLessthanStartDate",
        "วันสิ้นสุดต้องไม่น้อยกว่าวันเริ่ม",
        (endDate) => {
          const { startDate } = this.parent;
          return !endDate || !startDate || checkLenghtDate(startDate, endDate);
        }
      ),
    leaveType: string()
      .optional()
      .oneOf(leaveType, "ประเภทการลาไม่ถูกต้อง"),
    // status: string()
    //   .optional()
    //   .oneOf(statusType, "สถานะลาไม่ถูกต้อง"),
    reason: string()
      .optional()
      .max(500, "เหตุผลยาวเกินไป"),
    // userId: number()
    //   .optional()
    //   .integer("กรุณาใส่จำนวนเต็ม")
    //   .min(0, "กรุณาใส่จำนวนเต็มบวก"),
  }),
};

export default leaveSchema;
