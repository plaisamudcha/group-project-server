import auditService from "../services/audit-log.service.js";
import holidayService from "../services/holiday.service.js";
import createError from "../utils/create-error.util.js";
import prisma from "../config/prisma.js"; 

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

        // ใช้ transaction เพื่อสร้าง holiday และ audit log พร้อมกัน
        const result = await prisma.$transaction(async (tx) => {
            const createdHoliday = await holidayService.createHoliday(data);

            // เพิ่ม audit log
            await auditService.createAuditLog({
                action: "CREATE",
                relatedTable: "Holiday",
                relatedId: createdHoliday.id,
                detail: `สร้างวันหยุดใหม่: ${name} วันที่ ${date}`,
                userId: req.user.id,  
            }, tx);

            return createdHoliday;
        });

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

            // ตรวจสอบว่ามีวันหยุดนี้แล้วรึยัง (ยกเว้น record ปัจจุบัน)
            myHoliday.map(i => {
                if (i.date === date && i.id !== parseInt(id)) {
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

        // ใช้ transaction เพื่อแก้ไข holiday และ audit log พร้อมกัน
        const result = await prisma.$transaction(async (tx) => {
            const editedHoliday = await holidayService.patchHoliday(parseInt(id), editData);
            
            // สร้างข้อความ detail สำหรับการแก้ไข
            let changes = [];
            if (date) changes.push(`วันที่: ${isExist.date} To ${date}`);
            if (name) changes.push(`ชื่อ: ${isExist.name} To ${name}`);
            
            // เพิ่ม audit log
            await auditService.createAuditLog({
                action: "UPDATE",
                relatedTable: "Holiday",
                relatedId: parseInt(id),
                detail: `แก้ไขวันหยุด: ${changes.join(', ')}`,
                userId: req.user.id,  
            }, tx);
            
            return editedHoliday;
        });
        res.status(200).json({ message: 'แก้ไขวันหยุดเรียบร้อย', patchedData: result })
    },
    deleteHoliday: async (req, res) => {
        const { id } = req.params

        const isExist = await holidayService.fetchHolidayById(parseInt(id))
        if (!isExist) {
            createError(400, 'ไม่พบวันหยุดนี้')
        }

        // ใช้ transaction เพื่อลบ holiday และ audit log พร้อมกัน
        await prisma.$transaction(async (tx) => {
            const deletedHoliday = await holidayService.deleteHoliday(parseInt(id));
            
            // เพิ่ม audit log
            await auditService.createAuditLog({
                action: "DELETE",
                relatedTable: "Holiday",
                relatedId: parseInt(id),
                detail: `ลบวันหยุด: ${isExist.name} วันที่ ${isExist.date}`,
                userId: req.user.id,  
            }, tx);
        });

        res.status(200).json({ message: 'ลบวันหยุดเรียบร้อย' })
    }
};



export default holidayController;
