//TODO: uhhh so is anything in this file actually pure?
// because the rule is that pure utils can depend on pure utils, date seems like fairly foundational util...


const DayOfYear = () => {
    //https://stackoverflow.com/questions/8619879/javascript-calculate-the-day-of-the-year-1-366
    var now = new Date();
    var start = new Date(now.getFullYear(), 0, 0);
    var diff = (now - start) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
    var oneDay = 1000 * 60 * 60 * 24;
    var day = Math.floor(diff / oneDay);
    return parseInt(day, 10);
}

const Year = () => {
    return parseInt(new Date().getUTCFullYear(), 10);
}

const WeekOfYear = () => {
    var d = new Date();
    var dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    var yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
    return parseInt(Math.ceil((((d - yearStart) / 86400000) + 1)/7), 10);
}

const FirstDayOfWeek = (weekOfYear) => {
    return (weekOfYear - 1) * 7;
}

const date_util = {
    DayOfYear,
    Year,
    WeekOfYear,
    FirstDayOfWeek,
}
export default date_util;