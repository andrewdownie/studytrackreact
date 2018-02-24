import date_util from './date_util';

const DayData = (studyData, dayOfYear) => {
    var weekOfYear = date_util.WeekOfYearFromDayOfYear(dayOfYear);
    var dayOfWeek = date_util.DayOfWeekFromDayOfYear(dayOfYear);
    var todaysData = null;

    //Initial validation
    if(studyData == null){
        return null;
    }
    else if(dayOfYear > 366){
        return null;
    }
    else if(studyData.length < weekOfYear - 1){
        return null;
    }

    todaysData = studyData[weekOfYear - 1];
    return todaysData[dayOfWeek + 1];
}
const WeekData_DOY = (studyData, dayOfYear) => {
    var weekOfYear = date_util.WeekOfYearFromDayOfYear(dayOfYear);
    return WeekData_WOK(weekOfYear);
}

const WeekData_WOK = (studyData, weekOfYear) => {
    var weeksData = [];
    if(studyData == null){
        return null;
    }

    var firstDayOfWeek = date_util.FirstDayOfWeek(weekOfYear);
    for(var i = 0; i < 7; i++){

        var dayData = DayData(studyData, firstDayOfWeek + i);
        if(dayData != null){
            weeksData.push(dayData);
        }
        else{
            break;
        }

    }

    return weeksData;
}

const UpdateData_StudyTime = (projectName, dayOfYear) => {

}

const UpdateData_MinGoal = (projectName, dayOfYear) => {

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


const sheetdata_util = {
    DayData,
    WeekData_WOK,
    WeekData_DOY,
    CreateWeekData,
}
export default sheetdata_util;