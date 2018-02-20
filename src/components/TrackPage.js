import {Grid, Row, Col} from 'react-bootstrap';
import React, { Component } from 'react';

import TrackProjects from './TrackProjects';
import PreviousWeeks from './PreviousWeeks';
import StudyChart from './StudyChart';

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
        return{
            projectName: projectName,
            studyTimeMS: 0
        };
    }

    _initializeChainData(gapi){
        return {
            gapi: gapi,
            spreadsheet: {
                exists: false,
                title: "StudyTrackUserData",
                id: null
            },
            studysheet: {
                exists: false,
                title: date_util.Year().toString()
            }
        };
    }

    _findDaysData(studyData, dayOfYear){
        var todaysData = null;

        if(studyData == null){
            return null;
        }
        if(dayOfYear > 366){
            return null;
        }

        if(studyData.length >= dayOfYear - 1){
            todaysData = studyData[dayOfYear - 1];
        }

        return JSON.parse(todaysData);
    }

    _findWeeksData(studyData, weekOfYear){
        var weeksData = [];
        if(studyData == null){
            return null;
        }

        var firstDayOfWeek = (weekOfYear - 1) * 7;
        for(var i = 0; i < 7; i++){

            var dayData = this._findDaysData(studyData, firstDayOfWeek + i);
            if(dayData != null){
                weeksData.push(dayData);
            }
            else{
                break;
            }

        }

        return weeksData;
    }


    _initializeAPIsAndGetStudyData(){
        var chaindata = this._initializeChainData(this.props.gapi);
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

        var todaysData = this._findDaysData(studyData, date_util.DayOfYear());

        if(this.props.isSignedIn && this.state.studyData == null){
            studyData = this._initializeAPIsAndGetStudyData();
        }

        var weeksData = this._findWeeksData(studyData, date_util.WeekOfYear());
        var week = Chartify.Week(weeksData);
        //console.log(weeksData);
        //var weekJson = JSON.parse(weeksData);

        return(
        <Grid>
            <Row className="show-grid">
                <Col xs={12} >
                    <h1>This is TrackPage.js</h1>
                </Col>
                <Col xs={12} >
                    <p>{this.state.sheetData}</p>
                </Col>
            </Row>
            

            <TrackProjects />
            <p>Today:</p>
            <StudyChart graph_id="chart1" studyData={Chartify.Day(todaysData)} />
            <StudyChart graph_id="chart2" studyData={Chartify.Day(todaysData)} />
            <p>This week:</p>
            <StudyChart graph_id="chart3" studyData={week} />
            {/*<PreviousWeeks />*/}
        </Grid>
        );
    }

}

export default TrackPage;