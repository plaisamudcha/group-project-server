import { date, number, object, ref, string } from "yup";

// outtime (ต้องเป็นเวลาที่มากกว่าตอนเข้า)

//เช็ครูปแบบเวลา
const isValidTime = (value) => {
  return dayjs(value, "HH:mm", true).isValid();
};

//เช็คความต่างเวลา
const isAfter = (start, end) => {
  return dayjs(end, 'HH-mm').isAfter(dayjs(start, 'HH-mm'))
}

const shiftSchema = {
  createOrUpdateShift: object({
    name: string().required("กรุณาใส่ชื่อกะ"),
    inTime: string()
      .required("กรุณาใส่เวลาเริ่มงาน")
      .nullable()
      .test("valid-time", "รูปแบบเวลาเริ่มไม่ถูกต้อง", (value) =>
        value ? isValidTime(value) : null
      ),
    outTime: date()
      .required("กรุณาใส่เวลาเลิกงาน")
      .nullable()
      .test("valid-time", "รูปแบบเวลาเลิกไม่ถูกต้อง", (value) =>
        value ? isValidTime(value) : null
      )
      .test("is-after", "เวลาเลิกงานต้องมากกว่าเวลาเริ่มงาน", function (outTime) {
        const { inTime } = this.parent;
        return !outTime || !inTime || isAfter(inTime, outTime);
      }),
  }),
};

export default shiftSchema;
