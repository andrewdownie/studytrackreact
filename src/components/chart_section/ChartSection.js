import React, {Component} from 'react';
import {Row, Col} from 'react-bootstrap';
import StudyChart from './StudyChart';
import FaSpinner from 'react-icons/lib/fa/spinner';


const ChartSection = (props) => {
    if(props.gChartList.length === 0){
        return(
            <p><FaSpinner className="spin"/> Loading chart data...</p>
        );
    }

    return(
        <Row className="show-grid">
            {
                props.gChartList.map( (gChart, i) => {
                    return (
                        <Col key={"chartcol" + i} sm={props.chartColSize} >
                            <h2 className="chart-header">{gChart.title}</h2>
                            <StudyChart graph_id={"chart" + i} googleChartData={gChart.data} />
                        </Col>
                    )
                })
            }
        </Row>
    );
}

export default ChartSection;