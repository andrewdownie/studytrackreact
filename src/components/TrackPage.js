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
        this.state = {
            studyData: null,
            loadedFromRemote: false,
            showAddProject: false,
            showEditProject: false,
            editProject_name: "",
            editProject_minGoal: 0,
            editProject_idealGoal: 0,
        };



        this._openAddProjectModalCallback = this._openAddProjectModalCallback.bind(this);
        this._addProjectCallback = this._addProjectCallback.bind(this);

        this._openEditProjectModalCallback = this._openEditProjectModalCallback.bind(this);
        this._editProjectCallback = this._editProjectCallback.bind(this);
        this._deleteProjectCallback = this._deleteProjectCallback.bind(this);
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

        var projectNames = sheetdata_util.ProjectNames(studyData, wok);//TODO: this had -1 before???

        return {chartList, projectNames};
    }

    async _loadTrackPageData(){
        //TODO: there is a lot that will be done here in the future, for now it's working code mixed with example code
        if(this.props.isSignedIn === false || this.state.loadedFromRemote){
            return;
        }

        var gapiInfo = gapi_util.InitializeGAPIInfo(this.props.gapi, date_util.Year());

        //TODO: check local cache to see if we know the id of the sheet already (and also have study data)
        var local_data_cached = false;//TODO: note: this is just explaining what I want to do in the future using a simple code example

        if(local_data_cached){
            //Quick load will use the cached sheet name to do a single ajax request and grab the data
            // quick load is seperate from instant load, where previous data is display the moment the user visits a page, along with showing a loading icon to show that its checking the server for changes
            gapi_util.QuickLoad_LoadApisAndReturnAllStudyData(gapiInfo)
            .then((studyData) => {
                this.setState({gapiInfo, studyData, loadedFromRemote: true});
            });
        }
        else{
            gapi_util.FullLoad_LoadApisAndReturnAllStudyData(gapiInfo)
            .then((studyData) => {
                this.setState({gapiInfo, studyData, loadedFromRemote: true});
            });
        }
    }

    _setupThisWeek(gapiInfo){
        //Fill the current week with empty objects?
        //gapi_util.SendData(this.state.gapiInfo, "A" + currentWeek, [["{}","{}","{}","{}","{}","{}","{}","{}"]]);


        //TODO: we have all the data up to date right? (are we going to do full sheet loads then, or?)
        //TODO: if we load a previous week, then we never should need to load it again, in the cacheing, it needs to mark when it was loaded

        //TODO: keep going back until we find a week with goals
        var currentWeek = date_util.WeekOfYear() - 1;
        while(currentWeek > 0){
            currentWeek = currentWeek - 1;

            //TODO: why is WeekGoals() always returning goals, when I have some set to empty objects in the sheet...
            var weekGoals = sheetdata_util.WeekGoals(this.state.studyData, currentWeek);

            //TODO: how do I tell if goals are present? Loop over the keys?
            //TODO: the keys count doesn't work, weekGoals always has values in it...
            var numberOfGoals = Object.keys(weekGoals).length;
            if(numberOfGoals > 0){
                //TODO: take this week and send it in for this weeks goals
                
                gapi_util.Put(gapiInfo, "A" + (date_util.WeekOfYear()), [[JSON.stringify(weekGoals), "{}","{}","{}","{}","{}","{}","{}"]]);
                break;
            }
            else{
                console.log("zero");
            }
        }
    }
    
    _addProjectCallback(newProjectData){

        var wok = date_util.WeekOfYear();

        gapi_util.AddNewProject(this.state.gapiInfo, newProjectData)
        .then((response) => {

            //TODO: somehow the new project is already in here, even though I haven't set it yet?
            var studyData = this.state.studyData;
            studyData[wok - 1][0] = response;
            this.setState({studyData, showAddProject: false});
        });


    }
    _openAddProjectModalCallback(){
        console.log("open add project modal callback");
        this.setState({showAddProject: true});
    }
    _editProjectCallback(editProjectData){
        console.log(editProjectData);

        //TODO: create arrow func in gapi_util
        gapi_util.UpdateProject(this.state.gapiInfo, editProjectData)
        .then((response) => {
            console.log(response);

            var wok = date_util.WeekOfYear();
            var studyData = this.state.studyData;
            studyData[wok - 1] = response
            this.setState({studyData: studyData, showEditProject: false}, ()=>{
                console.log(this.state.studyData);
            });
        });
    }
    _openEditProjectModalCallback(projectName){
        console.log("open edit project modal callback");
        //TODO: WAIT SO THE ERROR HAPPENS ON OPENING THE EDIT PROJECT MODAL AFTER EDITING A PROJECT? wat does mean this?

        var wok = date_util.WeekOfYear();

        var projectGoals = this.state.studyData[wok - 1][0][projectName];


        var minGoal, idealGoal;
        //TODO: the error is that project goals is undefined...
        minGoal = projectGoals.minGoal;
        idealGoal = projectGoals.idealGoal;
        this.setState({
            showEditProject: true,
            editProject_name: projectName,
            editProject_minGoal: minGoal,
            editProject_idealGoal: idealGoal
        });
    }
    _deleteProjectCallback(){
        console.log("delete project now pls");
    }

    render(){
        this._loadTrackPageData();


        //TODO: the correct study data goes in
        var preparedChartData = this._prepareChartData(this.state.studyData);
        //TODO: the incorrect project names come out?

        /* TODO: this isnt working correctly...
        if(preparedChartData.projectNames === null && this.state.loadedFromRemote === true){
            this._setupThisWeek(this.state.gapiInfo);
            return(
                <p>Creating this weeks data...</p>
            );
        }
        */

        return(
        <Grid fluid>

            <Row className="show-grid">
                <Col xs={12} >
                    <PageHeader>Projects</PageHeader>
                        {/* TODO: make the projectsection into an arrow func once you fix the sheet index issue? */}
                    <ProjectSection
                        projectNames={sheetdata_util.ProjectNames(this.state.studyData, date_util.WeekOfYear())}
                        studyData={this.state.studyData}
                        addProjectCallback={this._addProjectCallback}
                        openAddProjectModalCallback={this._openAddProjectModalCallback}
                        editProjectCallback={this._editProjectCallback}
                        openEditProjectModalCallback={this._openEditProjectModalCallback}
                        deleteProjectCallback={this._deleteProjectCallback}
                        loadedFromRemote={this.state.loadedFromRemote}
                        showAddProject={this.state.showAddProject}
                        showEditProject={this.state.showEditProject}
                        editProject_name={this.state.editProject_name}
                        editProject_minGoal={this.state.editProject_minGoal}
                        editProject_idealGoal={this.state.editProject_idealGoal}
                    />
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