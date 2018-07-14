// Returns the current day of the year
const DayOfYear = () => {
    //https://stackoverflow.com/questions/8619879/javascript-calculate-the-day-of-the-year-1-366
    var now = new Date();
    var start = new Date(now.getFullYear(), 0, 0);
    var diff = (now - start) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
    var oneDay = 1000 * 60 * 60 * 24;
    var day = Math.floor(diff / oneDay);
    return parseInt(day, 10);
}

// Returns the current year
const Year = () => {
    return parseInt(new Date().getUTCFullYear(), 10);
}

// Returns the week of the current year
const WeekOfYear = () => {
    var d = new Date();
    var dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    var yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
    return parseInt(Math.ceil((((d - yearStart) / 86400000) + 1)/7), 10);
}

// Given a day of the year, returns the day of the current week
const DayOfWeekFromDayOfYear = (dayOfYear) => {
    return dayOfYear % 7;
}

// Returns the first day of the week, as a day of the year
const FirstDayOfWeek = (weekOfYear) => {
    return (weekOfYear - 1) * 7;
}

// Returns the index of the cell that holds info about the given day of the year
const CellFromDayOfYear = (dayOfYear) => {
    return DayOfWeekFromDayOfYear(dayOfYear) + 1;
}

const DateUtil = {
    DayOfWeekFromDayOfYear,
    CellFromDayOfYear,
    FirstDayOfWeek,
    WeekOfYear,
    DayOfYear,
    Year,
}
export default DateUtil;