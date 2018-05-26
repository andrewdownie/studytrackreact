import { Chart } from 'react-google-charts';
import React from 'react';

const StudyChart = (props) => {
    var chartData = [];

    if(props.googleChartData != null){
        chartData = props.googleChartData;
    }

    return(
        <Chart
            chartType="ColumnChart"
            data={chartData}
            options={{isStacked: true, chartArea:{width:"80%",height:"70%"}, legend: { position: 'none', maxLines: 0, textStyle: {color: 'black', fontSize: 16 } }}}
            graph_id={props.graph_id}
            width="100%"
            height="400px"
            legend_toggle
        />
    );
}

export default StudyChart;

