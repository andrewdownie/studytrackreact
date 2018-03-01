import {Grid, Row, Col, PageHeader} from 'react-bootstrap';
import React, { Component } from 'react';


import ProjectSection from '../components/project_section/ProjectSection';
import ChartSection from './chart_section/ChartSection';

import sheetdata_util from '../pure_utils/sheetdata_util';
import chart_util from '../pure_utils/chart_util';
import date_util from '../pure_utils/date_util';
import gapi_util from '../pure_utils/gapi_util';


//TODO: does this actually need to be a class?
class TrackPage extends Component {

    constructor(props){
        super(props);

        //loadedFromRemote will cause the ajax chain to run every time the page is fully reloaded
        //TODO: eventually studyData will be set to local cache contents right away
        this.state = {studyData: null, loadedFromRemote: false};
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
        .then(gapi_util.FillSheetIfJustCreated)
        .then(gapi_util.ReadStudyData)
        .then((response) => {

            var studyData = [];
            if(response.result.values != null && response.result.values.length > 0){
                for(var i = 0; i < response.result.values.length; i++){
                    var rowData = [];
                    for(var j = 0; j < response.result.values[i].length; j++){
                        var jsonData = JSON.parse(response.result.values[i][j]);
                        rowData.push(jsonData);
                    }
                    studyData.push(rowData);
                }
            }

            
            this.setState({studyData: studyData, loadedFromRemote: true});
            
        });
    }


    render(){
        //TODO: move to util, package the four charts data into json {today: data, currentWeek: data, lastWeek: data, twoWeeksAgo: data}
        var studyData = null;
        if(this.state.studyData != null){
            studyData = this.state.studyData;
        }

        if(this.props.isSignedIn && this.state.loadedFromRemote === false){
            studyData = this._initializeAPIsAndGetStudyData();
        }

        var wok = date_util.WeekOfYear();
        var doy = date_util.DayOfYear();

        var currentWeeksJson = sheetdata_util.WeekData_WOY(studyData, wok - 1);
        var lastWeeksJson = sheetdata_util.WeekData_WOY(studyData, wok - 2);
        var twoWeeksAgoJson = sheetdata_util.WeekData_WOY(studyData, wok - 3);

        var todaysData = chart_util.Day(currentWeeksJson, doy);
        var currentWeeksData = chart_util.Week(currentWeeksJson);
        var lastWeeksData = chart_util.Week(lastWeeksJson);
        var twoWeeksAgoData = chart_util.Week(twoWeeksAgoJson);


        return(
        <Grid fluid>

            <Row className="show-grid">
                <Col xs={12} >
                    <PageHeader>Projects</PageHeader>
                    <ProjectSection />
                </Col>
            </Row>

            <Row>
                <Col xs={12}>
                    <div className="margin-bottom-md"></div>
                </Col>
            </Row>

            <Row className="show-grid">
                <Col xs={12} >
                   <PageHeader>Track</PageHeader>
                   <ChartSection todaysData={todaysData} currentWeeksData={currentWeeksData} lastWeeksData={lastWeeksData} twoWeeksAgoData={twoWeeksAgoData}/>
                </Col>
            </Row>

        </Grid>
        );
    }

}

export default TrackPage;