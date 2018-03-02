import sheetdata_util from "./sheetdata_util";
import date_util from "./date_util";

const Day = (weekInfo, dayOfYear) => {

    var projName;

    if(weekInfo == null){
        return [];
    }

    var todaysCellIndex = date_util.CellFromDayOfYear(dayOfYear);

    var projectTotals = _WeeksGoals(weekInfo);
    var output = [];

    if(projectTotals == null){
        return [];
    }

    for(projName in projectTotals){
        projectTotals[projName].idealGoal = projectTotals[projName].idealGoal / 7;
        projectTotals[projName].minGoal = projectTotals[projName].minGoal / 7;
    }

    output.push(chart_data_header);

    for(projName in weekInfo[todaysCellIndex]){
        projectTotals[projName].studied += weekInfo[todaysCellIndex][projName].studied;
    }

    for(projName in projectTotals){
        output.push(_ChartifySingleProject(projName, projectTotals[projName]));
    }


    return output;
}

const Week = (weekInfo) => {
    /*
        Given a list of days(up to 7 rows in the sheet),
        returns a json object ready to be passed into the data parameter of a google chart object
    */
   var projName;
    if(weekInfo == null){
        return [];
    }

    var projectTotals;
    var output = [];

    output.push(chart_data_header);

    projectTotals = _WeeksGoals(weekInfo);

    if(projectTotals == null){
        return [];
    }

    //Tally the amount of study time for each project
    for(var i = 1; i < weekInfo.length; i++){

        for(projName in weekInfo[i]){
            projectTotals[projName].studied += weekInfo[i][projName].studied;
        }

    }

    for(projName in projectTotals){
        output.push(_ChartifySingleProject(projName, projectTotals[projName]));
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
    /*
        Calculates the studied/min/ideal relative to each other so they will chart properly,
    */

    var idealRemaining = talliedProjectInfo.idealGoal;
    var minRemaining = talliedProjectInfo.minGoal;
    var studied = talliedProjectInfo.studied;

    if(studied > minRemaining){
        minRemaining = 0;
    }
    else{
        minRemaining = minRemaining - studied;
    }
    idealRemaining = idealRemaining - minRemaining - studied;

    if(minRemaining < 0){
        minRemaining = 0;
    }
    if(idealRemaining < 0){
        idealRemaining = 0;
    }

    return [projectTitle, studied, minRemaining, idealRemaining, ""];
}

const chart_data_header = ['Time Tracking', 'Studied', 'Min', 'Ideal', { role: 'annotation' } ];

const chart_util = {
    Week,
    Day
}

export default chart_util;