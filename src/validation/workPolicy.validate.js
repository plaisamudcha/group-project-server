import { date, number, object, ref, string } from "yup";
import dayjs from "dayjs";

// endTime (ต้องเป็นเวลาที่มากกว่าตอนเข้า)

//เช็ครูปแบบเวลา
const isValidTime = (value) => {
  return dayjs(value, "HH:mm", true).isValid();
};

//เช็คความต่างเวลา
const isAfter = (start, end) => {
  return dayjs(end, "HH-mm").isAfter(dayjs(start, "HH-mm"));
};

const workPolicySchema = {
  createOrUpdateWorkPolicy: object({
    name: string().required("กรุณาใส่ชื่อ นโยบายการทำงาน"),
    startTime: string()
      .required("กรุณาใส่เวลาเริ่มงาน")
      .nullable()
      .test("valid-time", "รูปแบบเวลาเริ่มไม่ถูกต้อง", (value) =>
        value ? isValidTime(value) : true
      ),
    endTime: string()
      .required("กรุณาใส่เวลาเลิกงาน")
      .nullable()
      .test("valid-time", "รูปแบบเวลาเลิกไม่ถูกต้อง", (value) =>
        value ? isValidTime(value) : true
      )
      .test("is-after", "เวลาเลิกต้องมากกว่าเวลาเริ่ม", function (endTime) {
        const { startTime } = this.parent;
        return !endTime || !startTime || isAfter(endTime, startTime);
      }),
    allowedLateMinutesPerMonth: number()
      .typeError("กรุณาใส่จำนวนเต็ม")
      .integer("กรุณาใส่จำนวนเต็มบวก")
      .positive("กรุณาใส่จำนวนเต็มบวก")
      .required("กรุณาใส่นาทีที่ยอมให้สาย"),
    deductIfLateOver: number()
      .typeError("กรุณาใส่จำนวนเต็ม")
      .integer("กรุณาใส่จำนวนเต็มบวก")
      .required("กรุณาใส่จำนวนเงินที่หัก"),
    halfDayAbsentRule: number()
      .typeError("กรุณาใส่จำนวนบวก")
      .positive("กรุณาใส่จำนวนบวก")
      .required("กรุณาใส่จำนวนวัน"),
  }),
  UpdateWorkPolicy: object({
    name: string().nullable(),
    startTime: string()
      .nullable()
      .test("valid-time", "รูปแบบเวลาเริ่มไม่ถูกต้อง", (value) =>
        value ? isValidTime(value) : true
      ),
    endTime: string()
      .nullable()
      .test("valid-time", "รูปแบบเวลาเลิกไม่ถูกต้อง", (value) =>
        value ? isValidTime(value) : true
      )
      .test("is-after", "เวลาเลิกต้องมากกว่าเวลาเริ่ม", function (endTime) {
        const { startTime } = this.parent;
        return !endTime || !startTime || isAfter(startTime, endTime);
      }),
    allowedLateMinutesPerMonth: number()
      .nullable()
      .integer("กรุณาใส่จำนวนเต็มบวก")
      .positive("กรุณาใส่จำนวนเต็มบวก"),
    deductIfLateOver: number()
      .nullable()
      .integer("กรุณาใส่จำนวนเต็มบวก")
      .positive("กรุณาใส่จำนวนเต็มบวก"),
    halfDayAbsentRule: number().nullable().positive("กรุณาใส่จำนวนบวก"),
  }),
};

export default workPolicySchema;
