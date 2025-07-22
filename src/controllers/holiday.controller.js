import holidayService from "../services/holiday.service.js";
import createError from "../utils/create-error.util.js";

const holidayController = {
    createHoliday: async (req, res) => {
        const { date, name } = req.body

        const myHoliday = await holidayService.fetchHoliday()

        // ตรวจสอบว่ามีวันหยุดนี้แล้วรึยัง
        myHoliday.map(i => {
            if (i.name === name) {
                createError(400, 'มีวันหยุดนี้อยู่แล้วนะจ๊ะ')
            }
        })

        const data = {
            date: new Date(date),
            name
        }

        const createdHoliday = await holidayService.createHoliday(data)
        res.status(201).json({ message: 'เพิ่มวันหยุด เรียบร้อย' })
    },
    getHoliday: async (req, res) => {

        const resHoliday = await holidayService.fetchHoliday()
        if (resHoliday.length === 0) {
            res.status(200).json({message: 'ไม่พบข้อมูล'})
        }

        res.status(200).json({message: 'ขอดูวันหยุดสำเร็จ', holiday: {...resHoliday}})
    }
};



export default holidayController;
