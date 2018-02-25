import date_util from "./date_util";

//TODO: dayOfYear is becoming undefined even though when it's sent in it's a an int
const Day = (weekInfo, dayOfYear) => {
    //TODO: this runs twice in a row when the trackpage print runs once, 
    // the first time its the correct number, then suddenly its undefined
    console.log(dayOfYear);


    if(weekInfo == null){
        return [];
    }

    var todaysCellIndex = date_util.CellFromDayOfYear(dayOfYear);
    console.log(dayOfYear);
    console.log(todaysCellIndex);

    var projectTotals = _WeeksGoals(weekInfo);
    var output = [];

    if(projectTotals == null){
        return [];
    }

    for(var projName in projectTotals){
        projectTotals[projName].idealGoal = projectTotals[projName].idealGoal / 7;
        projectTotals[projName].minGoal = projectTotals[projName].minGoal / 7;
    }

    output.push(chart_data_header);

    for(var projSlot = 0; projSlot < weekInfo[todaysCellIndex].length; projSlot++){
        for(var projName in weekInfo[todaysCellIndex][projSlot]){
            projectTotals[projName].studied += weekInfo[todaysCellIndex][projSlot][projName].studied;
        }
    }

    //Adjust the min/ideal times using studied so they chart properly
    //TODO: this is already done in the sheet data util
    for(var projName in projectTotals){
        var idealRemaining = projectTotals[projName].idealGoal;
        var minRemaining = projectTotals[projName].minGoal;
        var studied = projectTotals[projName].studied;
        console.log(studied);

        if(studied > minRemaining){
            minRemaining = 0;
            idealRemaining = idealRemaining - studied;
        }
        else{
            minRemaining = minRemaining - studied;
        }

        if(minRemaining < 0){
            minRemaining = 0;
        }
        if(idealRemaining < 0){
            idealRemaining = 0;
        }

        output.push([projName, studied, minRemaining, idealRemaining, ""]);
    }


    return output;
}

const Week = (weekInfo) => {
    /*
        Given a list of days(up to 7 rows in the sheet),
        returns a json object ready to be passed into the data parameter of a google chart object
    */
   //console.log(JSON.parse(weekInfoJson));
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
        //TODO: change the list into just an object, so you can direclty index over that
        for(var projSlot = 0; projSlot < weekInfo[i].length; projSlot++){
            for(var projName in weekInfo[i][projSlot]){
                projectTotals[projName].studied += weekInfo[i][projSlot][projName].studied;
            }
        }
    }

    //Adjust the min/ideal times using studied so they chart properly
    //TODO: this is already done in the sheet data util
    for(var projName in projectTotals){
        var idealRemaining = projectTotals[projName].idealGoal;
        var minRemaining = projectTotals[projName].minGoal;
        var studied = projectTotals[projName].studied;
        console.log(studied);

        if(studied > minRemaining){
            minRemaining = 0;
            idealRemaining = idealRemaining - studied;
        }
        else{
            minRemaining = minRemaining - studied;
        }

        if(minRemaining < 0){
            minRemaining = 0;
        }
        if(idealRemaining < 0){
            idealRemaining = 0;
        }

        output.push([projName, studied, minRemaining, idealRemaining, ""]);
    }

    /*for(var projName in projectTotals){
        output.push([projName, projectTotals[projName].studied, projectTotals[projName].minGoal, projectTotals[projName].idealGoal, ""]);
    }*/

    console.log(output);
    return output;
}


const _WeeksGoals = (weekInfo) => {
    var projectTotals = {};

    if(weekInfo == null || weekInfo.length < 1){
        return null;
    }

    //-Get the names and goals of the projects
    var goals = weekInfo[0];

    //TODO: change the list into just an object, so you can direclty index over that
    for(var projSlot = 0; projSlot < goals.length; projSlot++){
        for(var projName in goals[projSlot]){
            projectTotals[projName] = {};
            projectTotals[projName].minGoal = goals[projSlot][projName].minGoal;
            projectTotals[projName].idealGoal = goals[projSlot][projName].idealGoal;
            projectTotals[projName].studied = 0;
        }
    }
    return projectTotals;
}


///
/// ChartifyProject
///
//TODO: I don't think I'm using this atm...
const Project = (projectInfo) => {
    /*
        Takes a single json project from the sheet, and repacks it to plug into google charts
        (calculates the studied/min/ideal relative to each other so they will chart properly,
        aka. converts the absolute values to relative chart values)
    */

    var title = projectInfo.title;
    var studied = parseInt(projectInfo.studied, 10);
    var min = projectInfo.min;
    var ideal = projectInfo.ideal - min;

    var outMin, outIdeal;

    if(studied > min){
        outMin = 0;
        outIdeal = ideal - (studied - min);
    }
    else{
        outMin = min - studied;
        outIdeal = ideal;
    }

    return [title, studied, outMin, outIdeal, ""];
}

const chart_data_header = ['Time Tracking', 'Studied', 'Min', 'Ideal', { role: 'annotation' } ];

const chart_util = {
    Week,
    Day
}

export default chart_util;