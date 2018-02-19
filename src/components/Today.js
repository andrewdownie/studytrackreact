import React from 'react';
import { render } from 'react-dom';
import { Chart } from 'react-google-charts';

const Today= (props) => {
    var todayTest = "";

    if(props.todaysData != null){
        todayTest = props.todaysData.projects[1].title;
    }
    
    return(
        <div>
            <div className={'my-pretty-chart-container'}>
                <Chart
                chartType="ColumnChart"
                data={
                    [
                        ['API Category', 'Social', 'Music', 'File Sharing', 'Storage',
                         'Weather', { role: 'annotation' } ],
                        ['2011', 98, 53, 12, 16, 6, ''],
                        ['2012', 151, 34, 26, 36, 49, ''],
                        ['2013', 69, 27, 22, 17, 15, ''],
                      ]
                }
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