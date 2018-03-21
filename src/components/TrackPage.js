import {Grid, Row, Col, PageHeader} from 'react-bootstrap';
import React, { Component } from 'react';

import ProjectSection from '../components/project_section/ProjectSection';
import ChartSection from './chart_section/ChartSection';
import ProjectModals from './Modals';
import Timer from './Timer';

import SheetUtil from '../utils/SheetUtil';
import ChartUtil from '../utils/ChartUtil';
import DateUtil from '../utils/DateUtil';
import GapiUtil from '../utils/GapiUtil';

class TrackPage extends Component {
    constructor(props){
        super(props);
        this.state = {
            studyData: null,
            loadedFromRemote: false,
            showAddModal: false,
            showEditModal: false,
            showLoadingModal: false,
            showStudyModal: false,
            showWarningModal: false,
            editProject_name: "",
            editProject_minGoal: 0,
            editProject_idealGoal: 0,
            timerTitle:'no timer started',
            timerDirection:'down',
            timerRunning:false,
            timerTime:0,
            closeModals: {
                closeEditModal: this._closeEditModal.bind(this),
                closeAddModal: this._closeAddModal.bind(this),
                closeLooadingModal: this._closeLoadingModal.bind(this),
                closeStudyModal: this._closeStudyModal.bind(this),
                closeWarningModal: this._closeWarningModal.bind(this),
            },
        };

        // Method bindings
        this._openLoadingModalCallback = this._openLoadingModalCallback.bind(this);
        this._openStudySessionModalCallback = this._openStudySessionModalCallback.bind(this);

        this._openAddProjectModalCallback = this._openAddProjectModalCallback.bind(this);
        this._addProjectCallback = this._addProjectCallback.bind(this);

        this._openEditProjectModalCallback = this._openEditProjectModalCallback.bind(this);
        this._editProjectCallback = this._editProjectCallback.bind(this);
        this._deleteProjectCallback = this._deleteProjectCallback.bind(this);

        this._startStudySession = this._startStudySession.bind(this);

        this._stopTimerCallback = this._stopTimerCallback.bind(this);


        this._quickStartStudyCallback = this._quickStartStudyCallback.bind(this);

        this._cancelStudySession = this._cancelStudySession.bind(this);
        this._stopTimerWarning = this._stopTimerWarning.bind(this);


        this._saveTimerDuration = this._saveTimerDuration.bind(this);
        this._showTimerWarning = this._showTimerWarning.bind(this);

    }

    _closeAddModal(){
        this.setState({showAddModal: false});
    }
    _closeEditModal(){
        this.setState({showEditModal: false});
    }
    _closeLoadingModal(){
        this.setState({showLoadingModal: false});
    }
    _closeStudyModal(){
        this.setState({showStudyModal: false});
    }
    _closeWarningModal(){
        this.setState({showWarningModal: false});
    }

    _prepareChartData(studyData){
        if(studyData == null){
            return {chartList: [], projectNames: []};
        }

        var wok = DateUtil.WeekOfYear();
        var doy = DateUtil.DayOfYear();
        var chartList = [];

        var todaysGChartData = ChartUtil.Day(studyData, doy);
        var currentWeeksGChartData = ChartUtil.Week(studyData, wok - 1);
        var lastWeeksGChartData = ChartUtil.Week(studyData, wok - 2);
        var twoWeeksAgoGChartData = ChartUtil.Week(studyData, wok - 3);



        chartList.push({title: "Today",         data: todaysGChartData});
        chartList.push({title: "Current Week",  data: currentWeeksGChartData});
        chartList.push({title: "Last Week",     data: lastWeeksGChartData});
        chartList.push({title: "Two Weeks Ago", data: twoWeeksAgoGChartData});

        var projectNames = SheetUtil.ProjectNames(studyData, wok);//TODO: this had -1 before???

        return {chartList, projectNames};
    }

    async _loadTrackPageData(){
        //TODO: there is a lot that will be done here in the future, for now it's working code mixed with example code
        if(this.props.isSignedIn === false || this.state.loadedFromRemote){
            return;
        }

        var gapiInfo = GapiUtil.InitializeGAPIInfo(this.props.gapi, DateUtil.Year());

        //TODO: check local cache to see if we know the id of the sheet already (and also have study data)
        var local_data_cached = false;//TODO: note: this is just explaining what I want to do in the future using a simple code example

        if(local_data_cached){
            //Quick load will use the cached sheet name to do a single ajax request and grab the data
            // quick load is seperate from instant load, where previous data is display the moment the user visits a page, along with showing a loading icon to show that its checking the server for changes
            GapiUtil.QuickLoad_LoadApisAndReturnAllStudyData(gapiInfo)
            .then((studyData) => {
                this.setState({gapiInfo, studyData, loadedFromRemote: true});
            });
        }
        else{
            GapiUtil.FullLoad_LoadApisAndReturnAllStudyData(gapiInfo)
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
        var currentWeek = DateUtil.WeekOfYear() - 1;
        while(currentWeek > 0){
            currentWeek = currentWeek - 1;

            //TODO: why is WeekGoals() always returning goals, when I have some set to empty objects in the sheet...
            var weekGoals = SheetUtil.WeekGoals(this.state.studyData, currentWeek);

            //TODO: how do I tell if goals are present? Loop over the keys?
            //TODO: the keys count doesn't work, weekGoals always has values in it...
            var numberOfGoals = Object.keys(weekGoals).length;
            if(numberOfGoals > 0){
                //TODO: take this week and send it in for this weeks goals
                
                GapiUtil.Put(gapiInfo, "A" + (DateUtil.WeekOfYear()), [[JSON.stringify(weekGoals), "{}","{}","{}","{}","{}","{}","{}"]]);
                break;
            }
            else{
                console.log("zero");
            }
        }
    }
    
    _addProjectCallback(newProjectData){
        this._openLoadingModalCallback("Creating: " + newProjectData.title + "...");

        var wok = DateUtil.WeekOfYear();

        GapiUtil.AddNewProject(this.state.gapiInfo, newProjectData)
        .then((response) => {
            var studyData = this.state.studyData;
            studyData[wok - 1][0] = response;
            this.setState({studyData, showLoadingModal: false});
        });


    }
    _openAddProjectModalCallback(){
        this.setState({
            showAddProject: true,
            showStudyModal: false,
            showEditModal: false,
            showLoadingModal: false,
        });
    }
    _openEditProjectModalCallback(projectName){

        var wok = DateUtil.WeekOfYear();

        var projectGoals = this.state.studyData[wok - 1][0][projectName];


        var minGoal, idealGoal;
        minGoal = projectGoals.minGoal;
        idealGoal = projectGoals.idealGoal;
        this.setState({
            showEditProject: true,
            editProject_name: projectName,
            editProject_minGoal: minGoal,
            editProject_idealGoal: idealGoal
        });
    }

    _editProjectCallback(editProjectData){
        this._openLoadingModalCallback("Editing: " + editProjectData.originalName + "...");

        GapiUtil.UpdateProject(this.state.gapiInfo, editProjectData)
        .then((response) => {

            var wok = DateUtil.WeekOfYear();
            var studyData = this.state.studyData;
            studyData[wok - 1] = response
            this.setState({studyData: studyData, showLoadingModal: false});

        });
    }

    _deleteProjectCallback(deleteProjectData){
        this._openLoadingModalCallback("Deleting: " + deleteProjectData.targetName + "...");

        GapiUtil.DeleteProject(this.state.gapiInfo, deleteProjectData)
        .then((response) => {
            var wok = DateUtil.WeekOfYear();
            var studyData = this.state.studyData;
            studyData[wok - 1] = response
            this.setState({studyData: studyData, showLoadingModal: false});
        });
    }

    _openStudySessionModalCallback(){
        this.setState({showStudyModal: true, showAddModal: false});
    }

    _openLoadingModalCallback(loadingData){
        this.setState({
            showEditProject: false,
            showAddProject: false,
            showLoadingModal: true,
            loadingModalMessage: loadingData
        });
    }

    _startStudySession(studySessionData){
        this.setState({
            showStudyModal: false,
            timerDirection: studySessionData.timerDirection,
            timerRunning: studySessionData.timerRunning,
            timerTitle: studySessionData.timerTitle,
            timerTime: studySessionData.timerTime,
        });
    }

    _stopTimerCallback(stopTimerInfo){

        if(stopTimerInfo.timerDirection === 'up'){
            if(stopTimerInfo.timerTime < 10 * 60){
                //TODO: show confimation modal to stop timer if less than 10 minutes
                //alert("You have studied less than 10 minutes, no progress will be saved if you stop now");
                this.setState({showWarningModal: true});
            }
        }
        this.setState({
            timerRunning: false,
        });
    }

    _stopTimerWarning(stopTimerInfo){
        //TODO: do I need stopTimerInfo?



        if(stopTimerInfo.timerDirection === 'up'){
            if(stopTimerInfo.timerTime < 10 * 60){
                //TODO: show confimation modal to stop timer if less than 10 minutes
                //alert("You have studied less than 10 minutes, no progress will be saved if you stop now");
                this.setState({showWarningModal: true});
            }
            else{
                //TODO: save teh timer
                //TODO: should the user be given a prompt before ending the timer?
            }
        }

    }

    _quickStartStudyCallback(projectName){
        //TODO: set timer stuff here
        this.setState({
            showStudyModal: false,
            timerDirection: 'up',
            timerRunning: true,
            timerTitle: projectName,
            timerTime: 0,
        });
    }

    _cancelStudySession(){
        this.setState({timerRunning: false, showWarningModal: false});
    }

    _saveTimerDuration(timerStopInfo){
        //TODO how is the state set to the wrong (and bigger) values before even getting here?


        //Step 1: get todays current total study time for the project (will require loading the entire day fresh)
        GapiUtil.GetTodaysStudyData(this.state.gapiInfo)
        .then((todaysStudyData) => {

            //Step 2: add the timer duration to the loaded total from step 1
            var todaysObject = JSON.parse(todaysStudyData.result.values[0]);
            var projectFound = false;
            for(var projName in todaysObject){

                if(projName == timerStopInfo.timerTitle){
                    projectFound = true;
                    break;
                }

            }

            var currentStudyTime = 0;
            if(!projectFound){
                todaysObject[timerStopInfo.timerTitle] = {};
            }
            else{
                currentStudyTime = todaysObject[timerStopInfo.timerTitle].studied;
            }
            todaysObject[timerStopInfo.timerTitle].studied = currentStudyTime + timerStopInfo.timerTime;
            
            //TODO: the updatedStudyData is wrong..
            var updatedStudyData = this.state.studyData;
            updatedStudyData[DateUtil.WeekOfYear() - 1][DateUtil.DayOfWeekFromDayOfYear(DateUtil.DayOfYear())] = todaysObject;
            this.setState({timerRunning: false, studyData: updatedStudyData},
            () => {
                console.log(this.state.studyData);
            });

            //Step 3: put the modified data back into the sheet (will require overwriting the entire day)
            var repackedData = JSON.stringify(todaysObject);
            GapiUtil.SetTodaysStudyData(this.state.gapiInfo, repackedData);
        });
    }
    _showTimerWarning(){
        this.setState({showWarningModal: true});
    }

    render(){
        this._loadTrackPageData();

        var preparedChartData = this._prepareChartData(this.state.studyData);

        return(
        <Grid fluid>

            <Row className="show-grid">
                <Col xs={12} >
                    <PageHeader>Projects</PageHeader>
                    {/* There are way too many props being passed around here... is this a bad thing? */}
                    {/* Maybe put them all into an object, and save that object to this.state? then it can
                    be passed directly with any un/re-packing*/}
                    <ProjectSection
                        projectNames={SheetUtil.ProjectNames(this.state.studyData, DateUtil.WeekOfYear())}
                        studyData={this.state.studyData}
                        openAddProjectModalCallback={this._openAddProjectModalCallback}
                        openEditProjectModalCallback={this._openEditProjectModalCallback}
                        openStudySessionModalCallback={this._openStudySessionModalCallback}
                        loadedFromRemote={this.state.loadedFromRemote}
                        quickStartStudyCallback={this._quickStartStudyCallback}
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

            <Row>
                <Col xs={12}>
                    <div className="large-space">
                    </div>
                </Col>
            </Row>

            <Row>
                <Col xs={12}>
                    <Timer
                    timerDirection={this.state.timerDirection}
                    timerRunning={this.state.timerRunning}
                    timerTitle={this.state.timerTitle}
                    timerStartTime={this.state.timerTime}
                    saveTimerDuration={this._saveTimerDuration}
                    showTimerWarning={this._showTimerWarning}
                    DeleteMe={this.DeleteMe}
                    />
                </Col>
            </Row>

            
            <ProjectModals
                startStudySession={this._startStudySession}
                showAddProject={this.state.showAddModal}
                showEditProject={this.state.showEditModal}
                showLoadingModal={this.state.showLoadingModal}
                showStudyModal={this.state.showStudyModal}
                showWarningModal={this.state.showWarningModal}
                loadingModalMessage={this.state.loadingModalMessage}
                addProjectCallback={this._addProjectCallback}
                editProjectCallback={this._editProjectCallback}
                deleteProjectCallback={this._deleteProjectCallback}
                editProject_name={this.state.editProject_name}
                editProject_minGoal={this.state.editProject_minGoal}
                editProject_idealGoal={this.state.editProject_idealGoal}
                projectNames={SheetUtil.ProjectNames(this.state.studyData, DateUtil.WeekOfYear())}
                cancelStudySession={this._cancelStudySession}
                closeModals={this.state.closeModals}
            />
        </Grid>
        );
    }

}

export default TrackPage;