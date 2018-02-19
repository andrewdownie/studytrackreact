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
                legend_toggle
            />

            </div>
        </div>
    );
};

export default Today;