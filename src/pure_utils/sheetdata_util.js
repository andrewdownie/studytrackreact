import date_util from './date_util';

const GetData_Day = (studyData, dayOfYear) => {
    var todaysData = null;

    if(studyData == null){
        return null;
    }
    if(dayOfYear > 366){
        return null;
    }

    if(studyData.length >= dayOfYear - 1){
        todaysData = studyData[dayOfYear - 1];
    }

    return JSON.parse(todaysData);
}

const GetData_Week = (studyData, weekOfYear) => {
    var weeksData = [];
    if(studyData == null){
        return null;
    }

    var firstDayOfWeek = date_util.FirstDayOfWeek(weekOfYear);
    for(var i = 0; i < 7; i++){

        var dayData = GetData_Day(studyData, firstDayOfWeek + i);
        if(dayData != null){
            weeksData.push(dayData);
        }
        else{
            break;
        }

    }

    return weeksData;
}

const UpdateData_StudyTime = (projectName) => {

}

const UpdateData_MinGoal = (projectName) => {

}


const sheetdata_util = {
    GetData_Day,
    GetData_Week,
}
export default sheetdata_util;