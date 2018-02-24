import {Grid, Row, Col, Button, ButtonGroup, PageHeader, Table} from 'react-bootstrap';
import React, { Component } from 'react';

import StudyChart from './StudyChart';

import sheetdata_util from '../pure_utils/sheetdata_util';
import chart_util from '../pure_utils/chart_util';
import date_util from '../pure_utils/date_util';
import gapi_util from '../pure_utils/gapi_util';

import FaEdit from 'react-icons/lib/fa/edit';
import FaPlus from 'react-icons/lib/fa/plus';
import MdSchedule from 'react-icons/lib/md/schedule';
import FaPlayCircle from 'react-icons/lib/fa/play-circle';

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

            console.log("study data is:");
            console.log(studyData);
            
            this.setState({studyData: studyData, loadedFromRemote: true});
            
        });
    }


    render(){
        var studyData = null;
        if(this.state.studyData != null){
            studyData = this.state.studyData;
        }

        var todaysData = sheetdata_util.DayData(studyData, date_util.DayOfYear());

        if(this.props.isSignedIn && this.state.loadedFromRemote === false){
            studyData = this._initializeAPIsAndGetStudyData();
        }

        if(studyData != null){
            //console.log("try pushing data to the sheet here or wat?");
        }

        var currentWeeksJson = sheetdata_util.WeekData_WOY(studyData, date_util.WeekOfYear());
        console.log(currentWeeksData);
        var currentWeeksData = chart_util.Week(currentWeeksJson);

        var lastWeeksJson = sheetdata_util.WeekData_WOY(studyData, date_util.WeekOfYear() - 1);
        var lastWeeksData = chart_util.Week(lastWeeksJson);

        var twoWeeksAgoJson = sheetdata_util.WeekData_WOY(studyData, date_util.WeekOfYear() - 2);
        var twoWeeksAgoData = chart_util.Week(twoWeeksAgoJson);



        //TODO: split this into appropriate components based on seperation of concerns...
        //TODO: oh sweet jebus there is a lot to seperate out here
        return(
        <Grid>

            <Row className="show-grid">
                <Col xs={12} >
                    <PageHeader>
                            Projects
                    </PageHeader>
                </Col>
                <Col xs={12}>
                    <ButtonGroup vertical block>
                        <Button className="btn-spacing-sm" bsStyle="primary"><MdSchedule/> Start Study Session</Button>
                        <Button className="btn-spacing-sm" bsStyle="success"><FaPlus/> New Project</Button>
                    </ButtonGroup>
                </Col>
                <Col xs={12}>
                    <div className="margin-bottom-md"></div>
                </Col>
                <Col xs={12} >
                    <Row className="show-grid">
                        <Col xs={12} >

                            <Table className="project-table" hover>
                                <tbody>
                                    <tr>
                                        <td><Button className="btn-responsive" bsStyle="link"><FaPlayCircle/> CTCI</Button></td>
                                        <td className="edit-btn-width"><Button className="edit-btn-width" bsSize="small" bsStyle="primary"><FaEdit/></Button></td>
                                    </tr>
                                    <tr>
                                        <td><Button className="btn-responsive" bsStyle="link"><FaPlayCircle/> Study Track React</Button></td>
                                        <td className="edit-btn-width"><Button className="edit-btn-width" bsSize="small" bsStyle="primary"><FaEdit/></Button></td>
                                    </tr>
                                    <tr>
                                        <td><Button className="btn-responsive" bsStyle="link"><FaPlayCircle/> Multiplayer AStar</Button></td>
                                        <td className="edit-btn-width"><Button className="edit-btn-width" bsSize="small" bsStyle="primary"><FaEdit/></Button></td>
                                    </tr>
                                    <tr>
                                        <td><Button className="btn-responsive" bsStyle="link"><FaPlayCircle/> Really really really really really really long name</Button></td>
                                        <td className="edit-btn-width"><Button className="edit-btn-width" bsSize="small" bsStyle="primary"><FaEdit/></Button></td>
                                    </tr>
                                    <tr>
                                        <td><Button className="btn-responsive" bsStyle="link"><FaPlayCircle/> SEAL PANGS</Button></td>
                                        <td className="edit-btn-width"><Button className="edit-btn-width" bsSize="small" bsStyle="primary"><FaEdit/></Button></td>
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
                            <StudyChart graph_id="chart_today" studyData={chart_util.Day(todaysData)} />
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