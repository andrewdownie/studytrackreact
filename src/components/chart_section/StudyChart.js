import React from 'react';
import { Chart } from 'react-google-charts';

const StudyChart = (props) => {
    var chartData = [];

    if(props.googleChartData != null){
        chartData = props.googleChartData;
    }

    return(
        <div className={props.graph_id}>
            <Chart
            chartType="ColumnChart"
            data={chartData}
            options={{isStacked: true, legend: { position: 'none', maxLines: 0, textStyle: {color: 'black', fontSize: 16 } }}}
            graph_id={props.graph_id}
            width="100%"
            height="400px"
            legend_toggle
        />

        </div>
    );
}

export default StudyChart;

