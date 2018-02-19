import {Grid, Row, Col} from 'react-bootstrap';
import React, { Component } from 'react';

import TrackProjects from './TrackProjects';
import PreviousWeeks from './PreviousWeeks';
import StudyChart from './StudyChart';

import date_util from '../pure_utils/date_util';

import gapi_util from './../pure_utils/gapi_util';

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

    _findTodaysData(studyData){


        if(studyData == null){
            console.log("wtf> study data was null in find todays data");
            return null;
        }
        console.log("notwtf> study data was not null in find todays data");
        console.log(studyData);

        var today = parseInt(date_util.DayOfYear(), 10);
        var todaysData = null;

        console.log(today - 1);
        //TODO: why is study data undefined
        console.log(studyData.length);
        if(studyData.length >= today - 1){
            todaysData = studyData[today - 1];
        }

        return todaysData;
    }

    _findWeeksData(weekOfYear){

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

        console.log("(meow)study data is: ");
        console.log(studyData);

        //TODO: why doesn't the correct data make it in???
        var todaysData = this._findTodaysData(studyData);
        console.log("todays data is: ");
        console.log(todaysData);

        if(this.props.isSignedIn && this.state.studyData == null){
            studyData = this._initializeAPIsAndGetStudyData();
        }

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
            <StudyChart studyData={JSON.parse(todaysData)} />
            <PreviousWeeks />
        </Grid>
        );
    }

}

export default TrackPage;