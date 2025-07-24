import { date, number, object, ref, string } from "yup";

const shiftSchema = {
  createOrUpdateShift: object({
    name: string().required("กรุณาใส่ชื่อ"),
    inTime: date().required("กรุณาใส่เวลาเริ่มงาน"),
    outTime: date().required("กรุณาใส่เวลาเลิกงาน"),
  }),
};

export default shiftSchema;
