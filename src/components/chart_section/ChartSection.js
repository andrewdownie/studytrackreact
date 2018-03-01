import React from 'react';
import {Row, Col} from 'react-bootstrap';
import StudyChart from './StudyChart';


const ChartSection = (props) => {
    return(
        <Row className="show-grid">
            <Row className="show-grid">
                <Col sm={6} >
                    <h2 className="chart-header">Today</h2>
                    <StudyChart graph_id="chart_today" studyData={props.todaysData} />
                </Col>
                <Col sm={6} >
                    <h2 className="chart-header">Current Week</h2>
                    <StudyChart graph_id="chart_1weekago" studyData={props.currentWeeksData} />
                </Col>
            </Row>

            <Row className="show-grid">
                <Col sm={6} >
                    <h2 className="chart-header">Last Week</h2>
                    <StudyChart graph_id="chart_2weeksago" studyData={props.lastWeeksData} />
                </Col>
                <Col sm={6} >
                    <h2 className="chart-header">Two Weeks Ago</h2>
                    <StudyChart graph_id="chart_3weeksago" studyData={props.twoWeeksAgoData} />
                </Col>
            </Row>
        </Row>
    );
}

export default ChartSection;