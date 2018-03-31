/* Helpers to help manipulate Google Sheet
study data once it's been brought local*/

import DateUtil from './DateUtil';

const RowOfSheet_WOY = (weekOfYear) => {
    return weekOfYear - 1;
}

const WeekGoals = (studyData, weekOfYear) => {
    //Each weeks goals are stored in the first cell of each row
    return studyData[weekOfYear][0];
}

const WeekData_DOY = (studyData, dayOfYear) => {
    var weekOfYear = DateUtil.WeekOfYear();
    var sheetRow = weekOfYear - 1
    return WeekData_WOY(studyData, sheetRow);
}

const WeekData_WOY = (studyData, weekOfYear) => {
    if(!studyData){
        return null;
    }
    return studyData[weekOfYear];
}

const UpdateData_StudyTime = (projectName, dayOfYear) => {

}
const UpdateData_MinGoal = (projectName, dayOfYear) => {

}
const UpdateData_IdealGoal = (projectName, dayOfYear) => {

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

    //TODO: THIS HAS THE WRONG DATA

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
    UpdateData_StudyTime,
    UpdateData_IdealGoal,
    UpdateData_MinGoal,
    CreateProjectGoal,
    CreateWeekData,
    RowOfSheet_WOY,
    WeekData_WOY,
    WeekData_DOY,
    ProjectNames,
    WeekGoals,
}

export default SheetUtil;
