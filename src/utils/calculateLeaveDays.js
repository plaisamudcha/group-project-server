import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore.js';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter.js';
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

export default function calculateLeaveDays(startDateString, endDateString, leaveSession = 'FULL_DAY') {
    const startDate = dayjs(startDateString);
    const endDate = dayjs(endDateString);

    if (startDate.isAfter(endDate)) {
        return { totalLeaveDays: 0, preciseStartDate: null, preciseEndDate: null };
    }

    // สำหรับการลาครึ่งวัน, วันที่เริ่มและจบต้องเป็นวันเดียวกัน
    if (leaveSession !== 'FULL_DAY' && !startDate.isSame(endDate, 'day')) {
        // อาจจะโยน Error หรือคืนค่าผิดพลาดเพื่อให้ Controller จัดการต่อ
        // ในที่นี้จะคืนค่า 0 เพื่อให้ Controller แจ้งเตือนผู้ใช้
        return { totalLeaveDays: 0, preciseStartDate: null, preciseEndDate: null };
    }

    const WORK_DAY_START_HOUR = 9;
    const MORNING_END_HOUR = 13; // สิ้นสุดครึ่งเช้า (ลาถึง 13:00)
    const AFTERNOON_START_HOUR = 14; // เริ่มครึ่งบ่าย (ลาตั้งแต่ 14:00)
    const WORK_DAY_END_HOUR = 18;

    let totalLeaveDays = 0;
    let preciseStartDate;
    let preciseEndDate;

    switch (leaveSession) {
        case 'HALF_DAY_MORNING':
            totalLeaveDays = 0.5;
            preciseStartDate = startDate.hour(WORK_DAY_START_HOUR).toISOString();
            preciseEndDate = endDate.hour(MORNING_END_HOUR).toISOString();
            break;
        
        case 'HALF_DAY_AFTERNOON':
            totalLeaveDays = 0.5;
            preciseStartDate = startDate.hour(AFTERNOON_START_HOUR).toISOString();
            preciseEndDate = endDate.hour(WORK_DAY_END_HOUR).toISOString();
            break;

        case 'FULL_DAY':
        default:
            // คำนวณวันลาเต็มวันแบบเดิม (วนลูปนับวัน)
            let currentDate = startDate.clone();
            while (currentDate.isSameOrBefore(endDate, 'day')) {
                totalLeaveDays += 1;
                currentDate = currentDate.add(1, 'day');
            }
            preciseStartDate = startDate.hour(WORK_DAY_START_HOUR).toISOString();
            preciseEndDate = endDate.hour(WORK_DAY_END_HOUR).toISOString();
            break;
    }

    return { totalLeaveDays, preciseStartDate, preciseEndDate };
}