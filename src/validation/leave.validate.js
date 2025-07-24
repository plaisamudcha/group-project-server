import { date, number, object, ref, string } from "yup";
import { LeaveType, StatusLeave } from "../../generated/prisma/client.js";

const leaveType = Object.values(LeaveType);
const statusType = Object.values(StatusLeave);

const leaveSchema = {
  createOrUpdateLeaveRequest: object({
    startDate: date().required("กรุณาใส่วันลา"),
    endDate: date().required("กรุณาใส่วันลา"),
    leaveType: string().oneOf(leaveType, "leaveType ไม่ถูกต้อง"),
    status: string().oneOf(statusType, "status ไม่ถูกต้อง"),
    reason: string().required("กรุณาใส่เหตุผล"),
    userId: string().required("กรุณาใส่ UserId"),
  }),
};

export default leaveSchema;
