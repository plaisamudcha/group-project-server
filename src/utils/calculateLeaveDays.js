/*
 * Calculates the total leave days based on a simple duration rule.
 * The result will always be in increments of 0.5.
 * @param {Date} startDate - The start date and time of the leave.
 * @param {Date} endDate - The end date and time of the leave.
 * @returns {number} The total number of leave days (e.g., 4.5).
 */
export function calculateLeaveDays(startDate, endDate) {
    let totalLeaveDays = 0;
    const WORK_DAY_START_HOUR = 9;
    const WORK_DAY_END_HOUR = 18;
    const DURATION_FOR_HALF_DAY = 4;

    for (let d = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()); d <= endDate; d.setDate(d.getDate() + 1)) {
        let dayValue = 1.0;
        const isFirstDay = d.toDateString() === startDate.toDateString();
        const isLastDay = d.toDateString() === endDate.toDateString();

        if (isFirstDay && isLastDay) {
            const hoursAbsent = (endDate.getTime() - startDate.getTime()) / 3600000;
            if (hoursAbsent <= DURATION_FOR_HALF_DAY) dayValue = 0.5;
        } else if (isFirstDay) {
            const hoursAbsent = WORK_DAY_END_HOUR - startDate.getHours();
            if (hoursAbsent <= DURATION_FOR_HALF_DAY) dayValue = 0.5;
        } else if (isLastDay) {
            const hoursAbsent = endDate.getHours() - WORK_DAY_START_HOUR;
            if (hoursAbsent <= DURATION_FOR_HALF_DAY) dayValue = 0.5;
        }
        
        totalLeaveDays += dayValue;
    }
    return totalLeaveDays;
}
