import { date, number, object, ref, string } from "yup";

// endTime (ต้องเป็นเวลาที่มากกว่าตอนเข้า)

const workPolicySchema = {
  createOrUpdateWorkPolicy: object({
    name: string().required("กรุณาใส่ชื่อ"),
    startTime: date()
      .nullable()
      .transform((value, originalValue) =>
        originalValue === "" ? null : new Date(originalValue)
      )
      .typeError("กรุณากรอกวันที่ให้ถูกต้อง")
      .required("กรุณาใส่เวลาเริ่มงาน"),
    endTime: date()
      .nullable()
      .test("is-after", "เวลาเลิกต้องมากกว่าเวลาเริ่ม", function (endTime) {
        const { startTime } = this.parent;
        return !endTime || !startTime || endTime > startTime;
      })
      .transform((value, originalValue) =>
        originalValue === "" ? null : new Date(originalValue)
      )
      .typeError("กรุณากรอกวันที่ให้ถูกต้อง")
      .required("กรุณาใส่เวลาเลิกงาน"),
    allowedLateMinutesPerMonth: number()
      .integer("กรุณาใส่จำนวนเต็มบวก")
      .positive("กรุณาใส่จำนวนเต็มบวก")
      .required("กรุณาใส่นาทีที่ยอมให้สาย"),
    deductIfLateOver: number()
      .integer("กรุณาใส่จำนวนเต็มบวก")
      .positive("กรุณาใส่จำนวนเต็มบวก")
      .required("กรุณาใส่จำนวนเงินที่หัก"),
    halfDayAbsentRule: number()
      .positive("กรุณาใส่จำนวนบวก")
      .required("กรุณาใส่จำนวนวัน"),
  }),
};

export default workPolicySchema;
