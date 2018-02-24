///
/// ChartifyWeek
///
const Week = (weekInfo) => {
    /*
        Given a list of days(up to 7 rows in the sheet),
        returns a json object ready to be passed into the data parameter of a google chart object
    */
   //console.log(JSON.parse(weekInfoJson));
    if(weekInfo == null){
        return [];
    }

    var projectTotals = {};
    var output = [];

    output.push(chart_data_header);

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
    for(var projName in projectTotals){
        var idealRemaining = projectTotals[projName].idealGoal;
        var minRemaining = projectTotals[projName].minGoal;
        var studied = projectTotals[projName].studied;

        if(studied > minRemaining){
            minRemaining = 0;
            idealRemaining = idealRemaining - (studied - minRemaining);
        }
        else{
            minRemaining = minRemaining - studied;
        }

        //output.push([projName, studied, minRemaining, idealRemaining, ""]);
    }

    for(var projName in projectTotals){
        output.push([projName, projectTotals[projName].studied, projectTotals[projName].minGoal, projectTotals[projName].idealGoal, ""]);
    }

    console.log(output);
    return output;
}

///
/// ChartifyDay
///
const Day = (dayInfo) => {
    /*
        Given a list of projects(a single row in the sheet),
        returns a json object ready to be passed into the data parameter of a google chart object
    */
    if(dayInfo == null){
        return [];
    }


    var output = [];
    output.push(chart_data_header);

    for(var i = 0; i < dayInfo.projects.length; i++){
        output.push(Project(dayInfo.projects[i]));
    }

    return output;
}

///
/// ChartifyProject
///
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