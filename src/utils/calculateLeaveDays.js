import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore.js';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter.js';
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

export default function calculateLeaveDays(startDateString, endDateString) {
    // ตรวจสอบว่า Input มีข้อมูลเวลาหรือไม่
    const hasStartTime = startDateString.includes('T');
    const hasEndTime = endDateString.includes('T');

    // ถ้าไม่มีเวลาเริ่มต้น ให้ตั้งเป็น 09:00
    // ถ้าไม่มีเวลาสิ้นสุด ให้ตั้งเป็น 18:00
    let startDate = hasStartTime ? dayjs(startDateString) : dayjs(startDateString).hour(9);
    let endDate = hasEndTime ? dayjs(endDateString) : dayjs(endDateString).hour(18);

    if (startDate.isAfter(endDate)) {
        return 0;
    }

    const WORK_DAY_START_HOUR = 9;
    const WORK_DAY_END_HOUR = 18;
    const DURATION_FOR_HALF_DAY = 4;

    let totalLeaveDays = 0;
    let currentDate = startDate.startOf('day');

    while (currentDate.isSameOrBefore(endDate, 'day')) {
        // ไม่ต้องมีการตรวจสอบวันเสาร์-อาทิตย์
        let dayValue = 1.0;

        const isFirstDay = currentDate.isSame(startDate, 'day');
        const isLastDay = currentDate.isSame(endDate, 'day');

        if (isFirstDay && isLastDay) {
            const hoursAbsent = endDate.diff(startDate, 'hour', true);
            if (hoursAbsent <= DURATION_FOR_HALF_DAY) dayValue = 0.5;
        } else if (isFirstDay) {
            const hoursAbsent = WORK_DAY_END_HOUR - startDate.hour();
            if (hoursAbsent <= DURATION_FOR_HALF_DAY) dayValue = 0.5;
        } else if (isLastDay) {
            const hoursAbsent = endDate.hour() - WORK_DAY_START_HOUR;
            if (hoursAbsent <= DURATION_FOR_HALF_DAY) dayValue = 0.5;
        }
        
        totalLeaveDays += dayValue;
        currentDate = currentDate.add(1, 'day');
    }
    return totalLeaveDays;
}