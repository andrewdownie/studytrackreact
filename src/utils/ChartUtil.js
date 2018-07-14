/* Deals with taking info from the Google sheet and
preparing it for being passed into a Google Chart */

import SheetUtil from "./SheetUtil";
import DateUtil from "./DateUtil";
import TimeUtil from "./TimeUtil";


// Prepares data to be passed into a google chart
// Grabs a day of the year, and calculates the studied, min, ideal values
//  for all projects of that week and formats it to the form that google chart expects
const Day = (studyData, dayOfYear) => {
    // Vars
    var weekInfo = SheetUtil.WeekData_DOY(studyData, dayOfYear);
    var todaysCellIndex = DateUtil.CellFromDayOfYear(dayOfYear);
    var projectTotals = WeeksGoals(weekInfo);
    var output = [];
    var projName;

    output.push(chart_data_header);

    // Errs
    if(weekInfo == null){
        return [];
    }
    if(projectTotals == null){
        return [];
    }

    // Divide weekly project goals by 7 to get daily project goals
    for(projName in projectTotals){
        projectTotals[projName].idealGoal = projectTotals[projName].idealGoal / 7;
        projectTotals[projName].minGoal = projectTotals[projName].minGoal / 7;
    }


    //Grab the amount of time studied today for each project
    for(projName in weekInfo[todaysCellIndex]){
        if(projectTotals[projName]){
            projectTotals[projName].studied = weekInfo[todaysCellIndex][projName].studied;
        }
    }

    // Chartify the data
    for(projName in projectTotals){
        output.push(ChartifySingleProject(projName, projectTotals[projName]));
    }

    if(output.length === 1){
        output.push(['', 0, '', 'black', '', 0, '', 'black', 0, '', 'black']);
    }

    return output;
}

// Prepares data to be passed into a google chart
// Grabs a week of the year, and calculates the studied, min, ideal values
//  for all projects of that week and formats it to the form that google chart expects
const Week = (studyData, weekOfYear) => {
    // Vars
    var weekInfo = SheetUtil.WeekData_WOY(studyData, weekOfYear);
    var projectTotals = WeeksGoals(weekInfo);
    var output = [];
    var projName;

    output.push(chart_data_header);

    // Errs
    if(weekInfo == null){
        return [];
    }
    if(projectTotals == null){
        return [];
    }

    // Tally the amount of study time spent this week on each project
    for(var i = 1; i < weekInfo.length; i++){
        for(projName in weekInfo[i]){

            if(projectTotals[projName]){
                projectTotals[projName].studied += weekInfo[i][projName].studied;
            }

        }
    }

    // Chartify the data
    for(projName in projectTotals){
        output.push(ChartifySingleProject(projName, projectTotals[projName]));
    }

    if(output.length === 1){
        output.push(['', 0, '', 'black', '', 0, '', 'black', 0, '', 'black']);
    }

    return output;
}

// Grabs the goals from the provided week of the year
const WeeksGoals = (weekInfo) => {
    var projectTotals = {};
    var projName;

    if(weekInfo == null || weekInfo.length < 1){
        return null;
    }

    var goals = weekInfo[0];

    for(projName in goals){
        projectTotals[projName] = {};
        projectTotals[projName].minGoal = goals[projName].minGoal;
        projectTotals[projName].idealGoal = goals[projName].idealGoal;
        projectTotals[projName].studied = 0; // REFACTOR: why is studied set to 0 here?
    }
    return projectTotals;
}

///
/// ChartifySingleProject
///

// Prepares a signle project to be feed into a google chart
// Calculates studied, min and ideal times
// Creates the tooltip
// Formats data to the form google charts expects
const ChartifySingleProject = (projectTitle, talliedProjectInfo) => {
    // Vars
    var idealRemaining = talliedProjectInfo.idealGoal;
    var minRemaining = talliedProjectInfo.minGoal;
    var studiedSeconds = talliedProjectInfo.studied;
    var studiedHours = studiedSeconds / 3600;

    // Calculate each value relative to each other so the three of them add up to idealGoal
    if(studiedHours > minRemaining){
        minRemaining = 0;
    }
    else{
        minRemaining = minRemaining - studiedHours;
    }
    idealRemaining = idealRemaining - minRemaining - studiedHours;

    // Clamp values to be 0 or above
    if(minRemaining < 0){
        minRemaining = 0;
    }
    if(idealRemaining < 0){
        idealRemaining = 0;
    }

    var totalTooltip = "Total Remaining: " + TimeUtil.FormatChartToolTip(idealRemaining + minRemaining);
    var idealTooltip = "Ideal Remaining: " + TimeUtil.FormatChartToolTip(idealRemaining);
    var minTooltip = "Min Remaining: " + TimeUtil.FormatChartToolTip(minRemaining);
    var studiedTooltip = "Studied: " + TimeUtil.FormatChartToolTip(studiedHours);


    var tooltip = projectTitle + "\n\n" + totalTooltip + "\n" + idealTooltip + "\n" + minTooltip + "\n" + studiedTooltip;


    var studiedColor = '#2ECC71';
    var minColor = '#E51400';
    var idealColor = '#F1C40f';


    var annotation = "";
    if(minRemaining === 0){
        minColor = studiedColor;
        annotation = "✓";
    }

    if(idealRemaining === 0){
        idealColor = studiedColor;
        annotation = "★";
    }


    return [
        projectTitle,
        studiedHours, tooltip, studiedColor, annotation,
        minRemaining, tooltip, minColor,
        idealRemaining, tooltip, idealColor,
    ];
}

// Total the amount of time spent studying for the target week
const TotalWeekStudyTime = (studyData, weekOfYear) => {
    // Vars
    var weekInfo = SheetUtil.WeekData_WOY(studyData, weekOfYear);
    var projectTotals = WeeksGoals(weekInfo);
    var output = 0;
    var projName;

    // Tally the amount of study time spent this week on each project
    for(var i = 1; i < weekInfo.length; i++){
        for(projName in weekInfo[i]){

            if(projectTotals[projName]){
                output += weekInfo[i][projName].studied;
            }

        }
    }

    return FormatTime(output);
};


// Total the amount of time spent studying for the target day
const TotalDayStudyTime = (studyData, dayOfYear) => {
    // Vars
    var weekInfo = SheetUtil.WeekData_DOY(studyData, dayOfYear);
    var todaysCellIndex = DateUtil.CellFromDayOfYear(dayOfYear);
    var projectTotals = WeeksGoals(weekInfo);
    var output = 0;
    var projName;
    
    //Grab the amount of time studied today for each project
    for(projName in weekInfo[todaysCellIndex]){
        if(projectTotals[projName]){
            output += weekInfo[todaysCellIndex][projName].studied;
        }
    }

    return FormatTime(output);
};

// Format time to H:MM
const FormatTime = (seconds) => {
    var hours = Math.floor(seconds / 3600);
    var minutes = Math.floor((seconds / 60) - (hours * 60));

    if(minutes === 0){
        minutes = "00";
    }
    else if (minutes <= 9){
        minutes = "0" + minutes;
    }

    return hours + ":" + minutes;
}

// Google chart desciption of the charts header
const chart_data_header = [
        'Time Tracking',
        'Studied', {role:'tooltip'}, {role: 'style'}, {role: 'annotation'},
        'Min', {role: 'tooltip'}, {role: 'style'},
        'Ideal', { role: 'tooltip' }, {role: 'style'},
];

const ChartUtil = {
    Week,
    Day,
    TotalWeekStudyTime,
    TotalDayStudyTime,
}

export default ChartUtil;