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
        var wok = date_util.WeekOfYear();
        var doy = date_util.DayOfYear();
        var chartList = [];
        var projectNames = [];
        var studyData = null;

        if(this.props.isSignedIn && this.state.loadedFromRemote === false){
            studyData = this._initializeAPIsAndGetStudyData();
        }

        if(this.state.studyData != null){
            studyData = this.state.studyData;
            var currentWeeksRaw = sheetdata_util.WeekData_WOY(studyData, wok - 1);
            var lastWeeksRaw = sheetdata_util.WeekData_WOY(studyData, wok - 2);
            var twoWeeksAgoRaw = sheetdata_util.WeekData_WOY(studyData, wok - 3);

            var todaysGChartData = chart_util.Day(currentWeeksRaw, doy);
            var currentWeeksGChartData = chart_util.Week(currentWeeksRaw);
            var lastWeeksGChartData = chart_util.Week(lastWeeksRaw);
            var twoWeeksAgoGChartData = chart_util.Week(twoWeeksAgoRaw);

            //TODO: maybe the title could be packaged in one of the above util functions?
            chartList.push({title: "Today", data: todaysGChartData});
            chartList.push({title: "Current Week", data: currentWeeksGChartData});
            chartList.push({title: "Last Week", data: lastWeeksGChartData});
            chartList.push({title: "Two Weeks Ago", data: twoWeeksAgoGChartData});


            projectNames = sheetdata_util.ProjectNames(currentWeeksRaw);
        }

        return(
        <Grid fluid>

            <Row className="show-grid">
                <Col xs={12} >
                    <PageHeader>Projects</PageHeader>
                    <ProjectSection projectNames={projectNames} />
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
                   <ChartSection chartColSize={6} gChartList={chartList}/>
                </Col>
            </Row>

        </Grid>
        );
    }

}

export default TrackPage;