/* Deals with taking info from the Google sheet and
preparing it for being passed into a Google Chart */

import SheetUtil from "./SheetUtil";
import DateUtil from "./DateUtil";

const Day = (studyData, dayOfYear) => {
    // Vars
    var weekInfo = SheetUtil.WeekData_DOY(studyData, dayOfYear);
    var todaysCellIndex = DateUtil.CellFromDayOfYear(dayOfYear);
    console.log(todaysCellIndex);
    var projectTotals = _WeeksGoals(weekInfo);
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
        output.push(_ChartifySingleProject(projName, projectTotals[projName]));
    }

    if(output.length === 1){
        output.push(["No study data this period", 0, 0, 0, ""]);
    }

    return output;
}

const Week = (studyData, weekOfYear) => {
    // Vars
    var weekInfo = SheetUtil.WeekData_WOY(studyData, weekOfYear);
    var projectTotals = _WeeksGoals(weekInfo);
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
        output.push(_ChartifySingleProject(projName, projectTotals[projName]));
    }

    if(output.length === 1){
        output.push(["No study data this period", 0, 0, 0, ""]);
    }

    return output;
}

const _WeeksGoals = (weekInfo) => {
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
        projectTotals[projName].studied = 0;
    }
    return projectTotals;
}

///
/// ChartifySingleProject
///
const _ChartifySingleProject = (projectTitle, talliedProjectInfo) => {
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

    return [projectTitle, studiedHours, minRemaining, idealRemaining, ""];
}

const chart_data_header = ['Time Tracking', 'Studied', 'Min', 'Ideal', { role: 'annotation' } ];

const ChartUtil = {
    Week,
    Day
}

export default ChartUtil;