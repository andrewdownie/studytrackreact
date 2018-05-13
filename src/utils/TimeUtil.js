const FormatChartToolTip = (hours) => {
    var outputHours = "", outputMinutes = "";

    outputHours = Math.floor(hours);
    outputMinutes = Math.floor((hours - outputHours) * 60);

    if(outputMinutes.toString().length < 2){
        outputMinutes = "0" + outputMinutes;
    }

    return outputHours + ":" + outputMinutes;
}

const TimeUtil = {
    FormatChartToolTip,
}
export default TimeUtil;