// ============================================
// src/utils/bookingHelpers.js
// EVORA - Real Date & Time Slot Availability Helpers
// ============================================

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS_FULL = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];
const MONTHS_SHORT = [
    'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
    'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'
];

/**
 * Generates an array of real date objects starting from today (or offset days)
 * @param {number} startOffsetDays - Day offset from today (e.g. 0 = today, 7 = next week)
 * @param {number} count - Number of consecutive days to generate
 */
export const generateBookingDays = (startOffsetDays = 0, count = 7) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dates = [];
    for (let i = 0; i < count; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() + startOffsetDays + i);

        const isToday =
            d.getFullYear() === today.getFullYear() &&
            d.getMonth() === today.getMonth() &&
            d.getDate() === today.getDate();

        const year = d.getFullYear();
        const monthIndex = d.getMonth();
        const dateNum = d.getDate();
        const isoDate = `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(dateNum).padStart(2, '0')}`;

        dates.push({
            date: d,
            day: DAYS_OF_WEEK[d.getDay()],
            num: dateNum,
            month: MONTHS_FULL[monthIndex],
            shortMonth: MONTHS_SHORT[monthIndex],
            year,
            monthIndex,
            isoDate,
            isToday,
        });
    }

    return dates;
};

/**
 * 24-hour time slots definitions
 */
export const ALL_HOURLY_SLOTS = [
    { hour: 0, time: '12:00 AM' },
    { hour: 1, time: '1:00 AM' },
    { hour: 2, time: '2:00 AM' },
    { hour: 3, time: '3:00 AM' },
    { hour: 4, time: '4:00 AM' },
    { hour: 5, time: '5:00 AM' },
    { hour: 6, time: '6:00 AM' },
    { hour: 7, time: '7:00 AM' },
    { hour: 8, time: '8:00 AM' },
    { hour: 9, time: '9:00 AM' },
    { hour: 10, time: '10:00 AM' },
    { hour: 11, time: '11:00 AM' },
    { hour: 12, time: '12:00 PM' },
    { hour: 13, time: '1:00 PM' },
    { hour: 14, time: '2:00 PM' },
    { hour: 15, time: '3:00 PM' },
    { hour: 16, time: '4:00 PM' },
    { hour: 17, time: '5:00 PM' },
    { hour: 18, time: '6:00 PM' },
    { hour: 19, time: '7:00 PM' },
    { hour: 20, time: '8:00 PM' },
    { hour: 21, time: '9:00 PM' },
    { hour: 22, time: '10:00 PM' },
    { hour: 23, time: '11:00 PM' },
];

/**
 * Checks if a slot time has passed based on selected date and current time
 * @param {number} slotHour - 0 to 23
 * @param {Date} targetDate - Date object of selected date
 */
export const isSlotInPast = (slotHour, targetDate) => {
    if (!targetDate) return false;

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const selected = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());

    if (selected < today) return true; // Past day
    if (selected > today) return false; // Future day

    // Today: block current hour and any earlier hours
    return slotHour <= now.getHours();
};

/**
 * Helper to get status for each time slot
 */
export const computeSlotStatus = ({
    slotHour,
    slotTime,
    selectedDate,
    bookedSlots = [],
    bayStatus = 'available',
}) => {
    if (isSlotInPast(slotHour, selectedDate)) {
        return {
            status: 'past',
            label: 'Past',
            disabled: true,
        };
    }

    if (bookedSlots.includes(slotTime)) {
        return {
            status: 'booked',
            label: 'Pre-booked',
            disabled: true,
        };
    }

    if (bayStatus === 'maintenance' || bayStatus === 'faulty' || bayStatus === 'unavailable') {
        return {
            status: 'unavailable',
            label: 'Unavailable',
            disabled: true,
        };
    }

    return {
        status: 'available',
        label: 'Available',
        disabled: false,
    };
};
