import React, { Component } from 'react';
import { render } from 'react-dom';
import { Chart } from 'react-google-charts';


class StudyChart extends Component{
    constructor(props){
        super(props);
    }

    render(){
        var chartData = [];

        if(this.props.studyData != null){
            //NOTE: studyData should be be converted using Chartify
            chartData = this.props.studyData;
        }

        return(
            <div className={'my-pretty-chart-container'}>
                <Chart
                chartType="ColumnChart"
                data={chartData}
                options={{isStacked: true, legend: { position: 'none', maxLines: 0, textStyle: {color: 'black', fontSize: 16 } }}}
                graph_id="ColumnChart"
                width="100%"
                height="400px"
                legend_toggle
            />

            </div>
        );
    }
}

export default StudyChart;

