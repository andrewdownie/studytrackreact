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

    // TODO: make this more intuitivie to understand/read
    _jsonifyStudyData(rawStudyData){
        var studyData = [];
        if(rawStudyData.result.values != null && rawStudyData.result.values.length > 0){

            // Go through each row
            for(var i = 0; i < rawStudyData.result.values.length; i++){
                var rowData = [];

                //Go thorugh each cell in the current row, and jsonify it's contents
                //TODO: this seems like a lot of work to do every page load? ..dunno, because even if they entire thing was one big json blob, it would all still need jsonifying
                for(var j = 0; j < rawStudyData.result.values[i].length; j++){
                    var jsonData = JSON.parse(rawStudyData.result.values[i][j]);
                    rowData.push(jsonData);
                }
                studyData.push(rowData);
            }
            
        }

        
        this.setState({studyData: studyData, loadedFromRemote: true});
    }

    render(){
        //TODO: move to util, package the four charts data into json {today: data, currentWeek: data, lastWeek: data, twoWeeksAgo: data}
        var wok = date_util.WeekOfYear();
        var doy = date_util.DayOfYear();
        var chartList = [];
        var projectNames = [];
        var studyData = null;

        if(this.props.isSignedIn && this.state.loadedFromRemote === false){
            var chaindata = gapi_util.InitializeGAPIChainData(this.props.gapi, date_util.Year());

            //TODO: check local cache to see if we know the id of the sheet already (and also have study data)
            var local_data_cached = false;//TODO: note: this is just explaining what I want to do in the future using a simple code example

            if(local_data_cached){
                studyData = this.state.gapi.QuickLoad_LoadApisAndReturnAllStudyData(chaindata)
                .then((rawStudyData) => {
                    this._jsonifyStudyData(rawStudyData);
                });
            }
            else{
                studyData = gapi_util.FullLoad_LoadApisAndReturnAllStudyData(chaindata)
                .then((rawStudyData) => {
                    this._jsonifyStudyData(rawStudyData);
                });
            }
        }

        if(this.state.studyData != null){

            studyData = this.state.studyData;

            //TODO: maybe the title could be packaged in one of the above util functions?
            //TODO: If I move this to a util, how will the names be assigned to the charts?
            var todaysGChartData = chart_util.Day(studyData, doy);
            var currentWeeksGChartData = chart_util.Week(studyData, wok - 1);
            var lastWeeksGChartData = chart_util.Week(studyData, wok - 2);
            var twoWeeksAgoGChartData = chart_util.Week(studyData, wok - 3);

            chartList.push({title: "Today", data: todaysGChartData});
            chartList.push({title: "Current Week", data: currentWeeksGChartData});
            chartList.push({title: "Last Week", data: lastWeeksGChartData});
            chartList.push({title: "Two Weeks Ago", data: twoWeeksAgoGChartData});


            projectNames = sheetdata_util.ProjectNames(studyData, wok - 1);
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