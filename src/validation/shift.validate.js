import { date, number, object, ref, string } from "yup";

// outtime (ต้องเป็นเวลาที่มากกว่าตอนเข้า)

const shiftSchema = {
  createOrUpdateShift: object({
    name: string().required("กรุณาใส่ชื่อ"),
    inTime: date()
      .nullable()
      .transform((value, originalValue) =>
        originalValue === "" ? null : new Date(originalValue)
      )
      .typeError("กรุณากรอกวันที่ให้ถูกต้อง")
      .required("กรุณาใส่เวลาเริ่มงาน"),
    outTime: date()
      .nullable()
      .test("is-after", "เวลาออกต้องมากกว่าเวลาเข้า", function (outTime) {
        const { inTime } = this.parent;
        return !outTime || !inTime || outTime > inTime;
      })
      .transform((value, originalValue) =>
        originalValue === "" ? null : new Date(originalValue)
      )
      .typeError("กรุณากรอกวันที่ให้ถูกต้อง")
      .required("กรุณาใส่เวลาเลิกงาน"),
  }),
};

export default shiftSchema;
