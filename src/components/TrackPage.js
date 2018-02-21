import {Grid, Row, Col} from 'react-bootstrap';
import React, { Component } from 'react';

import StudyChart from './StudyChart';

import sheetdata_util from '../pure_utils/sheetdata_util';
import date_util from '../pure_utils/date_util';
import gapi_util from '../pure_utils/gapi_util';

import Chartify from '../pure_utils/Chartify';

//TODO: does this actually need to be a class?
class TrackPage extends Component {

    constructor(props){
        super(props);

        this.state = {studyData: null};
    }


    _setupJsonProject(projectName){
        //TODO: move this to gapi_util?
        return{
            projectName: projectName,
            studyTimeMS: 0
        };
    }

    _initializeAPIsAndGetStudyData(){
        //TODO: move this to gapi_util?
        var chaindata = gapi_util.InitializeGAPIChainData(this.props.gapi, date_util.Year());
        gapi_util.LoadAPIs(chaindata)
        .then(gapi_util.CheckIfSSExists)
        .then(gapi_util.CreateSSIfNotExists)
        .then(gapi_util.CheckIfSheetExists)
        .then(gapi_util.CreateSheetIfNotExists)
        .then(gapi_util.ReadStudyData)
        .then((response) => {
            this.setState({studyData: response});
        });
    }


    render(){
        var studyData = null;
        if(this.state.studyData != null){
            studyData = this.state.studyData.result.values;
        }

        var todaysData = sheetdata_util.GetData_Day(studyData, date_util.DayOfYear());

        if(this.props.isSignedIn && this.state.studyData == null){
            studyData = this._initializeAPIsAndGetStudyData();
        }

        var currentWeeksJson = sheetdata_util.GetData_Week(studyData, date_util.WeekOfYear());
        var currentWeeksData = Chartify.Week(currentWeeksJson);

        var lastWeeksJson = sheetdata_util.GetData_Week(studyData, date_util.WeekOfYear() - 1);
        var lastWeeksData = Chartify.Week(lastWeeksJson);

        var twoWeeksAgoJson = sheetdata_util.GetData_Week(studyData, date_util.WeekOfYear() - 2);
        var twoWeeksAgoData = Chartify.Week(twoWeeksAgoJson);

        var threeWeeksAgoJson = sheetdata_util.GetData_Week(studyData, date_util.WeekOfYear() - 3);
        var threeWeeksAgoData = Chartify.Week(threeWeeksAgoJson);

        return(
        <Grid>
            <Row className="show-grid">
                <Col xs={12} >
                    <h1>Track</h1>
                </Col>
                <Col xs={12} >
                    <p>{this.state.sheetData}</p>
                </Col>
            </Row>
            
            <h2>Today</h2>
            <StudyChart graph_id="chart_today" studyData={Chartify.Day(todaysData)} />

            <h2>Current Week</h2>
            <StudyChart graph_id="chart_1weekago" studyData={currentWeeksData} />

            <h2>Last Week</h2>
            <StudyChart graph_id="chart_2weeksago" studyData={lastWeeksData} />

            <h2>Two Weeks Ago</h2>
            <StudyChart graph_id="chart_3weeksago" studyData={twoWeeksAgoData} />
            
            <h2>Three Weeks Ago</h2>
            <StudyChart graph_id="chart_4weeksago" studyData={threeWeeksAgoData} />

        </Grid>
        );
    }

}

export default TrackPage;