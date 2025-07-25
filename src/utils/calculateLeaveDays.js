import dayjs from 'dayjs';
// แนะนำให้ใช้ plugin เหล่านี้เพื่อการทำงานที่สมบูรณ์
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore.js';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter.js';
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

export default function calculateLeaveDays(startDateString, endDateString) {
    const startDate = dayjs(startDateString);
    const endDate = dayjs(endDateString);

    // เพิ่มการตรวจสอบ: ถ้าวันเริ่มอยู่หลังวันสิ้นสุด ให้คืนค่า 0
    if (startDate.isAfter(endDate)) {
        return 0;
    }

    // --- กฎของบริษัท (สามารถปรับเปลี่ยนได้) ---
    const WORK_DAY_START_HOUR = 9;
    const WORK_DAY_END_HOUR = 18;
    const DURATION_FOR_HALF_DAY = 4;

    let totalLeaveDays = 0;
    let currentDate = startDate.startOf('day');

    while (currentDate.isSameOrBefore(endDate, 'day')) {
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
