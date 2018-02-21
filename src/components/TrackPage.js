import {Grid, Row, Col, Button, PageHeader, Table} from 'react-bootstrap';
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



        //TODO: split this into appropriate components based on seperation of concerns...
        //TODO: oh sweet jebus there is a lot to seperate out here
        return(
        <Grid>

            <Row className="show-grid">
                <Col xs={12} >
                    <PageHeader>Projects</PageHeader>
                </Col>
                <Col xs={12} >
                    <Row className="show-grid">
                        <Col xs={12} >
                            <Button>New Project</Button>
                            <Button>Start Study Session</Button>
                        </Col>
                    </Row>
                    <br/>
                    <Row className="show-grid">
                        <Col xs={12} >
                            {/*<Button bsStyle="link">CTCI</Button>
                            <Button bsStyle="link">Study Track React</Button>
                            <Button bsStyle="link">Multiplayer AStar</Button>*/}

                            <Table condensed hover>
                                <thead>
                                    <tr>
                                        <th>Project</th>
                                        <th></th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td><Button bsStyle="link">CTCI</Button></td>
                                        <td><Button bsSize="small" bsStyle="warning">Rename</Button></td>
                                        <td><Button bsSize="small" bsStyle="danger">Delete</Button></td>
                                    </tr>
                                    <tr>
                                        <td><Button bsStyle="link">Study Track React</Button></td>
                                        <td><Button bsSize="small" bsStyle="warning">Rename</Button></td>
                                        <td><Button bsSize="small" bsStyle="danger">Delete</Button></td>
                                    </tr>
                                    <tr>
                                        <td><Button bsStyle="link">Multiplayer AStar</Button></td>
                                        <td><Button bsSize="small" bsStyle="warning">Rename</Button></td>
                                        <td><Button bsSize="small" bsStyle="danger">Delete</Button></td>
                                    </tr>
                                    <tr>
                                        <td><Button bsStyle="link">Really really really really long name</Button></td>
                                        <td><Button bsSize="small" bsStyle="warning">Rename</Button></td>
                                        <td><Button bsSize="small" bsStyle="danger">Delete</Button></td>
                                    </tr>
                                </tbody>
                            </Table>
                        </Col>
                    </Row>
                </Col>
            </Row>

            <Row className="show-grid">
                <Col xs={12} >
                    <br/>
                    <br/>
                    <br/>
                    <PageHeader>Track</PageHeader>
                </Col>
                <Col xs={12} >
                    <Row className="show-grid">
                        <Col sm={6} >
                            <h2>Today</h2>
                            <StudyChart graph_id="chart_today" studyData={Chartify.Day(todaysData)} />
                        </Col>
                        <Col sm={6} >
                            <h2>Current Week</h2>
                            <StudyChart graph_id="chart_1weekago" studyData={currentWeeksData} />
                        </Col>
                    </Row>

                    <Row className="show-grid">
                        <Col sm={6} >
                            <h2>Last Week</h2>
                            <StudyChart graph_id="chart_2weeksago" studyData={lastWeeksData} />
                        </Col>
                        <Col sm={6} >
                            <h2>Two Weeks Ago</h2>
                            <StudyChart graph_id="chart_3weeksago" studyData={twoWeeksAgoData} />
                        </Col>
                    </Row>
                </Col>
            </Row>

        </Grid>
        );
    }

}

export default TrackPage;