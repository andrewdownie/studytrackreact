import {Grid, Row, Col, PageHeader} from 'react-bootstrap';
import React, { Component } from 'react';

import ProjectSection from '../components/project_section/ProjectSection';
import ChartSection from './chart_section/ChartSection';
import ProjectModals from './Modals';
import TimerContainer from './TimerContainer';

import SheetUtil from '../utils/SheetUtil';
import ChartUtil from '../utils/ChartUtil';
import DateUtil from '../utils/DateUtil';
import GapiUtil from '../utils/GapiUtil';

class TrackPage extends Component {
    constructor(props){
        super(props);

        /* Method Bindings */
        this.openLoadingModalCallback = this.openLoadingModalCallback.bind(this);
        this.openStudySessionModalCallback = this.openStudySessionModalCallback.bind(this);
        this.openAddProjectModalCallback = this.openAddProjectModalCallback.bind(this);
        this.addProjectCallback = this.addProjectCallback.bind(this);
        this.openEditProjectModalCallback = this.openEditProjectModalCallback.bind(this);
        this.editProjectCallback = this.editProjectCallback.bind(this);
        this.deleteProjectCallback = this.deleteProjectCallback.bind(this);

        this.startStudySession = this.startStudySession.bind(this);

        this.stopTimerCallback = this.stopTimerCallback.bind(this);


        this.quickStartStudyCallback = this.quickStartStudyCallback.bind(this);

        this.cancelStudySession = this.cancelStudySession.bind(this);
        this.stopTimerWarning = this.stopTimerWarning.bind(this);


        this.saveTimerDuration = this.saveTimerDuration.bind(this);
        this.showTimerWarning = this.showQuickWarning.bind(this);

        this.showQuickWarning = this.showQuickWarning.bind(this);
        this.showStudyWarning = this.showStudyWarning.bind(this);

        this.closeStudyWarningModal = this.closeStudyWarningModal.bind(this);


        /* Initialize State */
        this.state = {
            studySession_selectedProject: "Loading projects...",
            studyData: null,
            loadedFromRemote: false,
            showAddModal: false,
            showEditModal: false,
            showLoadingModal: false,
            showStudyModal: false,
            showQuickWarningModal: false,
            editProject_name: "",
            editProject_minGoal: 0,
            editProject_idealGoal: 0,
            timerTitle:'no timer started',
            timerDirection:'down',
            timerRunning:false,
            timerTime:0,
            closeModals: {
                closeEditModal: this.closeEditModal.bind(this),
                closeAddModal: this.closeAddModal.bind(this),
                closeLooadingModal: this.closeLoadingModal.bind(this),
                closeStudyModal: this.closeStudyModal.bind(this),
                closeWarningModal: this.closeWarningModal.bind(this),
            },
            callbacks: {
                openStudyModal: this.openStudySessionModalCallback,
                openEditModal: this.openEditProjectModalCallback,
                openLoadingModal: this.openLoadingModalCallback,
                openAddModal: this.openAddProjectModalCallback,
                closeEditModal: this.closeEditModal.bind(this),
                deleteProject: this.deleteProjectCallback,
                editProject: this.editProjectCallback,
                addProject: this.addProjectCallback,
                quickStartStudy: this.quickStartStudyCallback,
            }
        };


    }

    closeAddModal(){
        this.setState({showAddModal: false});
    }
    closeEditModal(){
        this.setState({showEditModal: false});
    }
    closeLoadingModal(){
        this.setState({showLoadingModal: false});
    }
    closeStudyModal(){
        this.setState({showStudyModal: false});
    }
    closeWarningModal(){
        this.setState({showQuickWarningModal: false});
    }
    closeStudyWarningModal(){
        this.setState({showStudyWarningModal: false});
    }

    prepareChartData(studyData){
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

    async loadTrackPageData(){
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

    setupThisWeek(gapiInfo){
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
    
    addProjectCallback(newProjectData){
        this.openLoadingModalCallback("Creating: " + newProjectData.title + "...");

        var wok = DateUtil.WeekOfYear();

        GapiUtil.AddNewProject(this.state.gapiInfo, newProjectData)
        .then((response) => {
            var studyData = this.state.studyData;
            studyData[wok - 1][0] = response;
            this.setState({studyData, showLoadingModal: false});
        });


    }
    openAddProjectModalCallback(){
        console.log("Show add project now pls");
        this.setState({
            showAddModal: true,
            showStudyModal: false,
            showEditModal: false,
            showLoadingModal: false,
        });
    }
    openEditProjectModalCallback(projectName){
        console.log("Show edit project now pls");

        var wok = DateUtil.WeekOfYear();

        var projectGoals = this.state.studyData[wok - 1][0][projectName];

        console.log(projectName);
        console.log(projectGoals);


        var minGoal, idealGoal;
        minGoal = projectGoals.minGoal;
        idealGoal = projectGoals.idealGoal;
        this.setState({
            showEditModal: true,
            showAddModal: false,
            showLoadingModal: false,
            showStudyModal: false,
            editModal_name: projectName,
            editModal_minGoal: minGoal,
            editModal_idealGoal: idealGoal
        });
    }

    editProjectCallback(editProjectData){
        this.openLoadingModalCallback("Editing: " + editProjectData.originalName + "...");

        GapiUtil.UpdateProject(this.state.gapiInfo, editProjectData)
        .then((response) => {

            var wok = DateUtil.WeekOfYear();
            var studyData = this.state.studyData;
            studyData[wok - 1] = response
            this.setState({studyData: studyData, showLoadingModal: false});

        });
    }

    deleteProjectCallback(deleteProjectName){
        this.openLoadingModalCallback("Deleting: " + deleteProjectName + "...");


        GapiUtil.DeleteProject(this.state.gapiInfo, deleteProjectName)
        .then((response) => {
            var wok = DateUtil.WeekOfYear();
            var studyData = this.state.studyData;
            studyData[wok - 1] = response
            this.setState({studyData: studyData, showEditModal: false, showLoadingModal: false});
        });
    }

    openStudySessionModalCallback(){
        console.log("open study session modal");
        this.setState({showStudyModal: true});
    }

    openLoadingModalCallback(loadingData){
        this.setState({
            showEditProject: false,
            showAddProject: false,
            showLoadingModal: true,
            loadingModalMessage: loadingData
        });
    }

    startStudySession(studySessionData){
        console.log(studySessionData);

        this.setState({
            showStudyModal: false,
            timerDirection: studySessionData.timerDirection,
            timerRunning: studySessionData.timerRunning,
            timerTitle: studySessionData.timerTitle,
            timerTime: studySessionData.timerTime,
        });
    }

    stopTimerCallback(stopTimerInfo){

        if(stopTimerInfo.timerDirection === 'up'){
            if(stopTimerInfo.timerTime < 10 * 60){
                //TODO: show confimation modal to stop timer if less than 10 minutes
                //alert("You have studied less than 10 minutes, no progress will be saved if you stop now");
                this.setState({showQuickWarningModal: true});
            }
        }
        this.setState({
            timerRunning: false,
        });
    }

    stopTimerWarning(stopTimerInfo){
        //TODO: do I need stopTimerInfo?



        if(stopTimerInfo.timerDirection === 'up'){
            if(stopTimerInfo.timerTime < 10 * 60){
                //TODO: show confimation modal to stop timer if less than 10 minutes
                //alert("You have studied less than 10 minutes, no progress will be saved if you stop now");
                this.setState({showQuickWarningModal: true});
            }
            else{
                //TODO: save teh timer
                //TODO: should the user be given a prompt before ending the timer?
            }
        }

    }

    quickStartStudyCallback(projectName){
        //TODO: set timer stuff here
        this.setState({
            showStudyModal: false,
            timerDirection: 'up',
            timerRunning: true,
            timerTitle: projectName,
            timerTime: 0,
        });
    }

    cancelStudySession(timePassed){
        var timeToAddToSheet = Math.ceil(timePassed / 2);
        console.log("Time to add to sheet: " + timeToAddToSheet);
    }

    saveTimerDuration(timerStopInfo){


        //Step 1: get todays current total study time for the project (will require loading the entire day fresh)
        GapiUtil.GetTodaysStudyData(this.state.gapiInfo)
        .then((todaysStudyData) => {

            //Step 2: add the timer duration to the loaded total from step 1
            var todaysObject = JSON.parse(todaysStudyData.result.values[0]);
            var projectFound = false;
            for(var projName in todaysObject){

                if(projName === timerStopInfo.timerTitle){
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
            todaysObject[timerStopInfo.timerTitle].studied = 0;
            todaysObject[timerStopInfo.timerTitle].studied = currentStudyTime + timerStopInfo.timerTime;
            
            var updatedStudyData = this.state.studyData;


            var woy = DateUtil.WeekOfYear() - 1;
            var indexOfWeek = DateUtil.DayOfWeekFromDayOfYear(DateUtil.DayOfYear()) + 1;
            updatedStudyData[woy][indexOfWeek] = todaysObject;
            this.setState({timerRunning: false, studyData: updatedStudyData});

            //Step 3: put the modified data back into the sheet (will require overwriting the entire day)
            var repackedData = JSON.stringify(todaysObject);
            GapiUtil.SetTodaysStudyData(this.state.gapiInfo, repackedData);
        });
    }
    showQuickWarning(){
        this.setState({showQuickWarningModal: true});
    }
    showStudyWarning(){
        this.setState({showStudyWarningModal: true});
    }

    render(){
        this.loadTrackPageData();

        //TODO: does this get passed the correct values?
        //TODO: if this does get passed the correct values, does it render the old ones first anyway?
        var preparedChartData = this.prepareChartData(this.state.studyData);


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
                        callbacks={this.state.callbacks}
                        loadedFromRemote={this.state.loadedFromRemote}
                        showStudyWarningModal={this.showStudyWarning}
                        showEditModal={this.state.showEditModal}
                        editModal_idealGoal={this.state.editModal_idealGoal}
                        editModal_minGoal={this.state.editModal_minGoal}
                        editModal_name={this.state.editModal_name}
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
                    <TimerContainer
                        projectNames={SheetUtil.ProjectNames(this.state.studyData, DateUtil.WeekOfYear())}
                        timerDirection={this.state.timerDirection}
                        timerRunning={this.state.timerRunning}
                        timerTitle={this.state.timerTitle}
                        timerStartTime={this.state.timerTime}
                        saveTimerDuration={this.saveTimerDuration}
                        showQuickWarning={this.showQuickWarning}
                        showStudyWarning={this.showStudyWarning}
                        cancelStudySession={this.cancelStudySession}
                        closeStudyWarningModal={this.closeStudyWarningModal}
                        showStudyModal={this.state.showStudyModal}
                        startStudySession={this.startStudySession}
                    />
                </Col>
            </Row>

            
            <ProjectModals
                startStudySession={this.startStudySession}
                showAddModal={this.state.showAddModal}
                showEditProject={this.state.showEditModal}
                showLoadingModal={this.state.showLoadingModal}
                showStudyModal={this.state.showStudyModal}
                showQuickWarningModal={this.state.showQuickWarningModal}
                showStudyWarningModal={this.state.showStudyWarningModal}
                loadingModalMessage={this.state.loadingModalMessage}
                addProjectCallback={this.addProjectCallback}
                editProjectCallback={this.editProjectCallback}
                deleteProjectCallback={this.deleteProjectCallback}
                editProject_name={this.state.editProject_name}
                editProject_minGoal={this.state.editProject_minGoal}
                editProject_idealGoal={this.state.editProject_idealGoal}
                projectNames={SheetUtil.ProjectNames(this.state.studyData, DateUtil.WeekOfYear())}
                cancelStudySession={this.cancelStudySession}
                closeModals={this.state.closeModals}
            />
        </Grid>
        );
    }

}

export default TrackPage;