import React from 'react';
import { render } from 'react-dom';
import { Chart } from 'react-google-charts';


const calcChartify = (projectInfo) => {
    // Takes json data from the sheet, and repacks it to plug into google charts

    var title = projectInfo.title;
    var studied = projectInfo.studied;
    var min = projectInfo.min;
    var ideal = projectInfo.ideal;

    var outMin, outIdeal;

    if(studied > min){
        outMin = 0;
        outIdeal = ideal - (studied - min);
    }
    else{
        outMin = min - studied;
        outIdeal = ideal;
    }
    
    //return [title, studied, outMin, outIdeal];//TODO: things aren't being calculated correctly atm...
    return [title, 200, 500, 1000, ""];
}

const dataChartify = (chartData) => {
    //Given a list of projects, returns a json object ready to be passed into a google chart
    var header = ['Time Tracking', 'Studied', 'Min', 'Ideal', { role: 'annotation' } ];

    var output = [];
    output.push(header);

    for(var i = 0; i < chartData.projects.length; i++){
        output.push(calcChartify(chartData.projects[i]));
    }

    return output;
}

const Today = (props) => {

    var todayTest = "";
    var chartData = [];

    if(props.todaysData != null){
        todayTest = props.todaysData.projects[1].title;
        chartData = dataChartify(props.todaysData);

        console.log(chartData);
        console.log(exampleChartData);
    }


    
    return(
        //TODO: make this chart load data dynamically
        <div>
            <div className={'my-pretty-chart-container'}>
                <Chart
                chartType="ColumnChart"
                data={chartData}
                options={{isStacked: true, legend: { position: 'top', maxLines: 3, textStyle: {color: 'black', fontSize: 16 } }}}
                graph_id="ColumnChart"
                width="100%"
                height="400px"
                legend_toggle
            />

            </div>
        </div>



        /*<div>
            <h2>This is Today.js</h2>
            <p>Todays data next:</p>
            <p>{todayTest}</p>

            <div className={'my-pretty-chart-container'}>
                <Chart
                chartType="ColumnChart"
                data={[['Age', 'Weight'], [8, 12], [4, 5.5]]}
                options={{}}
                graph_id="ScatterChart"
                width="100%"
                height="400px"
                stacked="true"
                legend_toggle
            />

            </div>
        </div>*/
    );
};

export default Today;