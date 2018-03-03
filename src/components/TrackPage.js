import {Grid, Row, Col, PageHeader} from 'react-bootstrap';
import React, { Component } from 'react';

import ProjectSection from '../components/project_section/ProjectSection';
import ChartSection from './chart_section/ChartSection';

import sheetdata_util from '../pure_utils/sheetdata_util';
import chart_util from '../pure_utils/chart_util';
import date_util from '../pure_utils/date_util';
import gapi_util from '../pure_utils/gapi_util';

class TrackPage extends Component {
    constructor(props){
        super(props);
        this.state = {studyData: null, loadedFromRemote: false};
    }

    _prepareChartData(studyData){
        if(studyData == null){
            return {chartList: [], projectNames: []};
        }

        var wok = date_util.WeekOfYear();
        var doy = date_util.DayOfYear();
        var chartList = [];

        var todaysGChartData = chart_util.Day(studyData, doy);
        var currentWeeksGChartData = chart_util.Week(studyData, wok - 1);
        var lastWeeksGChartData = chart_util.Week(studyData, wok - 2);
        var twoWeeksAgoGChartData = chart_util.Week(studyData, wok - 3);

        chartList.push({title: "Today",         data: todaysGChartData});
        chartList.push({title: "Current Week",  data: currentWeeksGChartData});
        chartList.push({title: "Last Week",     data: lastWeeksGChartData});
        chartList.push({title: "Two Weeks Ago", data: twoWeeksAgoGChartData});

        var projectNames = sheetdata_util.ProjectNames(studyData, wok - 1);

        return {chartList, projectNames};
    }

    _loadTrackPageData(studyData){
        //TODO: there is a lot that will be done here in the future, for now it's working code mixed with example code
        if(this.props.isSignedIn === false || this.state.loadedFromRemote){
            return;
        }

        var chaindata = gapi_util.InitializeGAPIChainData(this.props.gapi, date_util.Year());

        //TODO: check local cache to see if we know the id of the sheet already (and also have study data)
        var local_data_cached = false;//TODO: note: this is just explaining what I want to do in the future using a simple code example

        if(local_data_cached){
            studyData = gapi_util.QuickLoad_LoadApisAndReturnAllStudyData(chaindata)
            .then((studyData) => {
                this.setState({studyData: studyData, loadedFromRemote: true});
            });
        }
        else{
            studyData = gapi_util.FullLoad_LoadApisAndReturnAllStudyData(chaindata)
            .then((studyData) => {
                this.setState({studyData: studyData, loadedFromRemote: true});
            });
        }
    }

    render(){
        this._loadTrackPageData(this.state.studyData);
        var preparedChartData = this._prepareChartData(this.state.studyData);

        return(
        <Grid fluid>

            <Row className="show-grid">
                <Col xs={12} >
                    <PageHeader>Projects</PageHeader>
                    <ProjectSection projectNames={preparedChartData.projectNames} />
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
                   <ChartSection chartColSize={6} gChartList={preparedChartData.chartList}/>
                </Col>
            </Row>

        </Grid>
        );
    }

}

export default TrackPage;