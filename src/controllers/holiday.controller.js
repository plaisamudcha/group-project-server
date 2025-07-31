import holidayService from "../services/holiday.service.js";
import createError from "../utils/create-error.util.js";

const holidayController = {
    createHoliday: async (req, res) => {
        const { date, name } = req.body

        const myHoliday = await holidayService.fetchHoliday()

        // ตรวจสอบว่ามีวันหยุดนี้แล้วรึยัง
        myHoliday.map(i => {
            if (i.date === date) {
                createError(400, 'มีวันหยุดวันที่นี้ในระบบอยู่แล้ว')
            }
        })

        const data = {
            date,
            name
        }

        const createdHoliday = await holidayService.createHoliday(data)
        res.status(201).json({ message: 'เพิ่มวันหยุด เรียบร้อย' })
    },
    getHoliday: async (req, res) => {
        const resHoliday = await holidayService.fetchHoliday()
        if (resHoliday.length === 0) {
            res.status(200).json({ message: 'ไม่พบข้อมูล' })
        }

        res.status(200).json({ message: 'ขอดูวันหยุดสำเร็จ', holiday: resHoliday })
    },
    editHoliday: async (req, res) => {
        const { date, name } = req.body
        const { id } = req.params

        if (date) {

            const myHoliday = await holidayService.fetchHoliday()

            // ตรวจสอบว่ามีวันหยุดนี้แล้วรึยัง
            myHoliday.map(i => {
                if (i.date === date) {
                    createError(400, 'มีวันหยุดวันที่นี้ในระบบอยู่แล้ว')
                }
            })

        }

        const isExist = await holidayService.fetchHolidayById(parseInt(id))
        if (!isExist) {
            createError(400, 'ไม่พบวันหยุดนี้')
        }

        let editData = {}
        if (date) editData.date = date
        if (name) editData.name = name

        const editedHoliday = await holidayService.patchHoliday(parseInt(id), editData)
        res.status(200).json({ message: 'แก้ไขวันหยุดเรียบร้อย', patchedData: editedHoliday })
    },
    deleteHoliday: async (req, res) => {
        const { id } = req.params

        const isExist = await holidayService.fetchHolidayById(parseInt(id))
        if (!isExist) {
            createError(400, 'ไม่พบวันหยุดนี้')
        }

        const deletedHoliday = await holidayService.deleteHoliday(parseInt(id))
        res.status(200).json({ message: 'ลบวันหยุดเรียบร้อย' })
    }
};



export default holidayController;
