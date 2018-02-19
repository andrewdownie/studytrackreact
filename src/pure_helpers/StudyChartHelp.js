///
/// ChartifyDay
///
const ChartifyDay = (chartData) => {
    /*
        Given a list of projects(a single row in the sheet),
        returns a json object ready to be passed into the data parameter of a google chart object
    */
    var header = ['Time Tracking', 'Studied', 'Min', 'Ideal', { role: 'annotation' } ];

    var output = [];
    output.push(header);

    for(var i = 0; i < chartData.projects.length; i++){
        output.push(ChartifyProject(chartData.projects[i]));
    }

    return output;
}
export default ChartifyDay;

///
/// ChartifyProject
///
const ChartifyProject = (projectInfo) => {
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