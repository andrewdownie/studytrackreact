/* Helpers to help manipulate Google Sheet
study data once it's been brought local */

import DateUtil from './DateUtil';

// Returns the row of the sheet that corresponds to the given week of year
const RowOfSheet_WOY = (weekOfYear) => {
    return weekOfYear - 1;
}

// Returns the goals for the given week of year
const WeekGoals = (studyData, weekOfYear) => {
    //Each weeks goals are stored in the first cell of each row
    return studyData[weekOfYear][0];
}

// Returns the week data
//TODO: it doesn't look like dayOfYear parameter is needed...
const WeekData_DOY = (studyData, dayOfYear) => {
    var weekOfYear = DateUtil.WeekOfYear();
    var sheetRow = weekOfYear - 1
    return WeekData_WOY(studyData, sheetRow);
}

// Returns the week data for the given week of the year
const WeekData_WOY = (studyData, weekOfYear) => {
    if(!studyData){
        return null;
    }
    return studyData[weekOfYear];
}

const CreateWeekData = (projectGoals=[], studyData=[]) => {
    //TODO: will project goals (a list of projectGoals) turn into a json list properly?
    return (
        {
            projectGoals: projectGoals,
            studyData: studyData
        }
    );
}

const CreateProjectGoal = (title, minGoal, idealGoal) => {
    return (
        {
            title: title,
            minGoal: minGoal,
            idealGoal: idealGoal,
        }
    );
}

const CreateProjectStudyTime = (title, studyTime=0) => {
    return (
        {
            title: title,
            studyTime: studyTime,
        }
    );
}

const ProjectNames = (studyData, weekOfYear) => {

    if(studyData == null){
        return [];
    }

    //TODO: this has the correct data
    //TODO: study data goes in correct
    var weeksDataRaw = WeekData_WOY(studyData, weekOfYear - 1);//TODO: there's a problem here
    //TODO: weeksDataRaw comes out with old name???
    //console.log(studyData[weekOfYear - 1]);

    //TODO: THIS HAS THE WRONG DATA //... has this been figured out?

    if(weeksDataRaw == null){
        return null;
    }


    var goals = weeksDataRaw[0];
    var projectNames = [];

    for(var projName in goals){
        projectNames.push(projName)
    }

    return projectNames;
}

const SheetUtil = {
    CreateProjectStudyTime,
    CreateProjectGoal,
    CreateWeekData,
    RowOfSheet_WOY,
    WeekData_WOY,
    WeekData_DOY,
    ProjectNames,
    WeekGoals,
}

export default SheetUtil;
