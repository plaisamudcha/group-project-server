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
  createShift: object({
    name: string().required("กรุณาใส่ชื่อกะ"),
    inTime: string()
      .required("กรุณาใส่เวลาเริ่มงาน")
      .nullable()
      .test("valid-time", "รูปแบบเวลาเริ่มไม่ถูกต้อง", (value) =>
        value ? isValidTime(value) : true
      ),
    outTime: date()
      .required("กรุณาใส่เวลาเลิกงาน")
      .nullable()
      .test("valid-time", "รูปแบบเวลาเลิกไม่ถูกต้อง", (value) =>
        value ? isValidTime(value) : true
      )
      .test("is-after", "เวลาเลิกงานต้องมากกว่าเวลาเริ่มงาน", function (outTime) {
        const { inTime } = this.parent;
        return !outTime || !inTime || isAfter(inTime, outTime);
      }),
  }),
  UpdateShift: object({
    name: string().nullable(),
    inTime: string()
      .nullable()
      .test("valid-time", "รูปแบบเวลาเริ่มไม่ถูกต้อง", (value) =>
        value ? isValidTime(value) : true
      ),
    outTime: date()
      .nullable()
      .test("valid-time", "รูปแบบเวลาเลิกไม่ถูกต้อง", (value) =>
        value ? isValidTime(value) : true
      )
      .test("is-after", "เวลาเลิกงานต้องมากกว่าเวลาเริ่มงาน", function (outTime) {
        const { inTime } = this.parent;
        return !outTime || !inTime || isAfter(inTime, outTime);
      }),
  }),
};

export default shiftSchema;
