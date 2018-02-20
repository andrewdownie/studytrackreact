///
/// ChartifyWeek
///
const Week = (weekInfo) => {
    /*
        Given a list of days(up to 7 rows in the sheet),
        returns a json object ready to be passed into the data parameter of a google chart object
    */
    if(weekInfo == null){
        return [];
    }

    var projectTotals = {};
    var output = [];

    output.push(chart_data_header);


    for(var i = 0; i < weekInfo.length; i++){
        for(var j = 0; j < weekInfo[i].projects.length; j++){

            var title = weekInfo[i].projects[j].title;
            if(title in projectTotals === false){
                projectTotals[title] = {};
                projectTotals[title].studied = 0;
                projectTotals[title].min = 0;
                projectTotals[title].ideal = 0;
            }

            projectTotals[title].studied += weekInfo[i].projects[j].studied;
            projectTotals[title].min += weekInfo[i].projects[j].min;
            projectTotals[title].ideal += weekInfo[i].projects[j].ideal;

        }
    }

    for(var key in projectTotals){
        output.push([key, projectTotals[key].studied, projectTotals[key].min, projectTotals[key].ideal, ""]);
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

const Chartify = {
    Week,
    Day
}

export default Chartify;