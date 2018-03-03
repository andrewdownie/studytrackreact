import date_util from './date_util';

const WeekGoals = (studyData, weekOfYear) => {
    //Each weeks goals are stored in the first cell of each row
    return JSON.parse(studyData[weekOfYear][0]);
}

const WeekData_DOY = (studyData, dayOfYear) => {
    var weekOfYear = date_util.WeekOfYearFromDayOfYear(dayOfYear);
    return WeekData_WOY(studyData, weekOfYear);
}

//TODO: THESE DONT ACTUALLY DO ANYTHING JUST MOVE EM TO THE CHART UTIL
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
    var weeksDataRaw = WeekData_WOY(studyData, weekOfYear);
    var goals = weeksDataRaw[0];
    var projectNames = [];

    for(var projName in goals){
        projectNames.push(projName)
    }

    return projectNames;
}

const sheetdata_util = {
    WeekData_WOY,
    WeekData_DOY,
    WeekGoals,
    CreateWeekData,
    CreateProjectGoal,
    CreateProjectStudyTime,
    UpdateData_StudyTime,
    UpdateData_MinGoal,
    UpdateData_IdealGoal,
    ProjectNames,
}
export default sheetdata_util;