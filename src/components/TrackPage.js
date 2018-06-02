import {Button, Grid, Row, Col, PageHeader} from 'react-bootstrap';
import React, { Component } from 'react';

import ProjectSection from '../components/project_section/ProjectSection';
import ChartSection from './chart_section/ChartSection';
import TimerContainer from './TimerContainer';

import SheetUtil from '../utils/SheetUtil';
import ChartUtil from '../utils/ChartUtil';
import DateUtil from '../utils/DateUtil';
import GapiUtil from '../utils/GapiUtil';

/* Html5 audio in react
https://stackoverflow.com/questions/44121471/html5-audio-is-not-playing-in-my-react-app-in-localhost
*/
import tickSound from "./../resources/tickSound30.mp3";
import alarmSound from "./../resources/alarmSound.mp3";

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

        this.stopTimerClick = this.stopTimerCallback.bind(this);


        this.quickStartStudyCallback = this.quickStartStudyCallback.bind(this);

        this.cancelStudySession = this.cancelStudySession.bind(this);
        this.stopTimerClick = this.stopTimerWarning.bind(this);


        this.saveTimerDuration = this.saveTimerDuration.bind(this);
        this.showTimerWarning = this.openQuickWarning.bind(this);

        this.openQuickWarning = this.openQuickWarning.bind(this);
        this.openStudyWarning = this.openStudyWarning.bind(this);

        this.closeStudyWarningModal = this.closeStudyWarningModal.bind(this);

        this.hideQuickWarningModal = this.hideQuickWarningModal.bind(this);
        this.hideStopSessionModal = this.hideStopSessionModal.bind(this);

        // Load current timer (if there is one)
        var timerRunning = false;
        var timerTitle = 'no timer running';
        var timerDirection = 'down';
        var timerStart = 0;
        var timerEnd = 0;
        var timerTime = 0;
        var timerVolume = 0.5;
        var alarmVolume = 0.5;

        if(localStorage.timerRunning != null) {

            timerRunning = localStorage.timerRunning === 'true';
            if(timerRunning === true){
                if(localStorage.timerTitle != null) {
                    timerTitle = localStorage.timerTitle;
                }
                if(localStorage.timerDirection != null) {
                    timerDirection = localStorage.timerDirection;
                }
                if(localStorage.timerStart != null){
                    timerStart = localStorage.timerStart;
                }
                if(localStorage.timerEnd != null){
                    timerEnd = localStorage.timerEnd;
                }
                if(localStorage.timerTime != null){
                    timerTime = localStorage.timerTime;
                }
                if(localStorage.timerVolume != null){
                    timerVolume = localStorage.timerVolume;
                }
                if(localStorage.alarmVolume != null){
                    alarmVolume = localStorage.alarmVolume;
                }



            }
        }



        /* Initialize State */
        this.state = {
            studySession_selectedProject: "Loading projects...",
            studyData: null,
            loadedFromRemote: false,
            showAddModal: false,
            showEditModal: false,
            showLoadingModal: false,
            showStudyModal: false,
            quickWarningVisible: false,
            stopSessionVisible: false,
            editProject_name: "",
            editProject_minGoal: 0,
            editProject_idealGoal: 0,
            timerTitle: timerTitle,
            timerDirection: timerDirection,
            timerRunning: timerRunning,
            timerTime: timerTime,
            timerStart: timerStart,
            timerEnd: timerEnd,
            timerVolume: timerVolume,
            alarmVolume: alarmVolume,
            projectSectionVisible: true,
            chartSectionVisible: true,
            isSignedIn: props.isSignedIn,
            closeModals: {
                closeEditModal: this.closeEditModal.bind(this),
                closeAddModal: this.closeAddModal.bind(this),
                closeLoadingModal: this.closeLoadingModal.bind(this),
                closeStudyModal: this.closeStudyModal.bind(this),
                closeWarningModal: this.closeWarningModal.bind(this),
            },
            callbacks: {
                openStudyModal: this.openStudySessionModalCallback,
                openEditModal: this.openEditProjectModalCallback,
                openLoadingModal: this.openLoadingModalCallback,
                openAddModal: this.openAddProjectModalCallback,
                closeAddModal: this.closeAddModal.bind(this),
                closeEditModal: this.closeEditModal.bind(this),
                deleteProject: this.deleteProjectCallback,
                editProject: this.editProjectCallback,
                addProject: this.addProjectCallback,
                quickStartStudy: this.quickStartStudyCallback,
                cancelStudySession: this.cancelStudySession,
                toggleChartSectionVisible: this.toggleChartSectionVisible.bind(this),
                toggleProjectSectionVisible: this.toggleProjectSectionVisible.bind(this),
                saveTimerDuration: this.saveTimerDuration,
            }
        };

        // TODO: I don't think this works in the constuctor for where the tag is defined...
        // this.refs.audio_tickSound30.play();
        // tickSound.addEventListener('ended', function() {
        //     this.currentTime = 0;
        //     this.play();
        // }, false);



        this.loadTrackPageData();
    }

    componentWillReceiveProps(nextProps){
        this.setState({
            isSignedIn: nextProps.isSignedIn,
        });
    }

    componentDidMount(){
        if(this.state.timerRunning){
            this.refs.audio_tickSound30.play();
        }

        this.refs.audio_tickSound30.loop = true;
        this.refs.audio_tickSound30.volume = this.state.timerVolume;
        this.refs.audio_alarmSound.volume = this.state.alarmVolume;
        this.setState({
            audio_tickSound30: this.refs.audio_tickSound30,
            audio_alarmSound: this.refs.audio_alarmSound,
        });
    }

    toggleChartSectionVisible(){
        this.setState({chartSectionVisible: !this.state.chartSectionVisible});
    }
    toggleProjectSectionVisible(){
        this.setState({projectSectionVisible: !this.state.projectSectionVisible});
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
        this.setState({openQuickWarningModal: false});
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
        var threeWeeksAgoGChartData = ChartUtil.Week(studyData, wok - 4);
        var fourWeeksAgoGChartData = ChartUtil.Week(studyData, wok - 5);

        var todaysTotalStudy = ChartUtil.TotalDayStudyTime(studyData, doy);
        var currentWeeksTotalStudy = ChartUtil.TotalWeekStudyTime(studyData, wok - 1);
        var lastWeeksTotalStudy = ChartUtil.TotalWeekStudyTime(studyData, wok - 2);
        var twoWeeksAgoTotalStudy = ChartUtil.TotalWeekStudyTime(studyData, wok - 3);
        var threeWeeksAgoTotalStudy = ChartUtil.TotalWeekStudyTime(studyData, wok - 4);
        var fourWeeksAgoTotalStudy = ChartUtil.TotalWeekStudyTime(studyData, wok - 5);



        chartList.push({title: "Today",         data: todaysGChartData, studiedThisPeriod: todaysTotalStudy});
        chartList.push({title: "Current Week",  data: currentWeeksGChartData, studiedThisPeriod: currentWeeksTotalStudy});
        chartList.push({title: "Last Week",     data: lastWeeksGChartData, studiedThisPeriod: lastWeeksTotalStudy});
        chartList.push({title: "Two Weeks Ago", data: twoWeeksAgoGChartData, studiedThisPeriod: twoWeeksAgoTotalStudy});
        chartList.push({title: "Three Weeks Ago", data: threeWeeksAgoGChartData, studiedThisPeriod: threeWeeksAgoTotalStudy});
        chartList.push({title: "Four Weeks Ago", data: fourWeeksAgoGChartData, studiedThisPeriod: fourWeeksAgoTotalStudy});

        var projectNames = SheetUtil.ProjectNames(studyData, wok);//TODO: this had -1 before???

        return {chartList, projectNames};
    }

    async loadTrackPageData(){
        if(this.props.isSignedIn === false || this.state.loadedFromRemote){
            return;
        }

        var gapiInfo = GapiUtil.InitializeGAPIInfo(this.props.gapi, DateUtil.Year());

        var local_data_cached = localStorage.spreadsheet_id != null && localStorage.studysheet_title != null;

        if(local_data_cached){

            gapiInfo.spreadsheet.exists = true;
            gapiInfo.spreadsheet.id = localStorage.spreadsheet_id;
            gapiInfo.studysheet.exists = true;
            gapiInfo.studysheet.title = localStorage.studysheet_title;

            //Quick load will use the cached sheet name to do a single ajax request and grab the data
            // quick load is seperate from instant load, where previous data is display the moment the user visits a page, along with showing a loading icon to show that its checking the server for changes
            GapiUtil.QuickLoad_LoadApisAndReturnAllStudyData(gapiInfo)
            .then((studyData) => {
                this.setState({gapiInfo, studyData, loadedFromRemote: true});

                var currentWeek = DateUtil.WeekOfYear() - 1;
                if(studyData[currentWeek] === undefined || Object.keys(studyData[currentWeek][0]).length === 0){
                    this.setupThisWeek(gapiInfo);
                }
            });
        }
        else{
            GapiUtil.FullLoad_LoadApisAndReturnAllStudyData(gapiInfo)
            .then((studyData) => {
                this.setState({gapiInfo, studyData, loadedFromRemote: true});

                localStorage.spreadsheet_id = gapiInfo.spreadsheet.id;
                localStorage.studysheet_title = gapiInfo.studysheet.title;

                var currentWeek = DateUtil.WeekOfYear() - 1;
                if(studyData[currentWeek] === undefined || Object.keys(studyData[currentWeek][0]).length === 0){
                    this.setupThisWeek(gapiInfo);
                }

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


                GapiUtil.Put(gapiInfo, "A" + (DateUtil.WeekOfYear()), [[JSON.stringify(weekGoals), "{}","{}","{}","{}","{}","{}","{}"]])
                .then(this.copyGoalsToThisWeek(weekGoals, currentWeek));
                break;
            }
            else{
                console.log("zero");
            }
        }
    }

    copyGoalsToThisWeek(weekGoals, currentWeek){
        var newWeekStudyData = [];
        newWeekStudyData[0] = weekGoals;
        for(let i = 1; i < 8; i++){
            newWeekStudyData[i] = {};
        }
        var studyData = this.state.studyData;
        studyData[currentWeek + 1] = newWeekStudyData;

        this.setState({studyData: studyData}, () => {});
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
        this.setState({
            showAddModal: true,
            showStudyModal: false,
            showEditModal: false,
            showLoadingModal: false,
        });
    }
    openEditProjectModalCallback(projectName){

        var wok = DateUtil.WeekOfYear();

        var projectGoals = this.state.studyData[wok - 1][0][projectName];



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
            this.setState({studyData: studyData, showLoadingModal: false});
        });
    }

    openStudySessionModalCallback(){
        this.setState({showStudyModal: true});
    }

    openLoadingModalCallback(loadingData){
        this.setState({
            showEditModal: false,
            showAddModal: false,
            showLoadingModal: true,
            loadingModalMessage: loadingData
        });
    }

    startStudySession(studySessionData){
        // console.log(studySessionData);

        this.setState({
            showStudyModal: false,
            timerDirection: studySessionData.timerDirection,
            timerRunning: studySessionData.timerRunning,
            timerTitle: studySessionData.timerTitle,
            timerTime: studySessionData.timerTime,
            timerStart: studySessionData.timerStart,
            timerEnd: studySessionData.timerEnd,
        });
    }

    //TODO: hide the timer here, let timer container know that the timer has stopped
    //TODO: the only state I should have to set here is the timer being displayed, right?
    stopTimerCallback(stopTimerInfo){

        if(stopTimerInfo.timerDirection === 'up'){
            if(stopTimerInfo.timerTime < 10 * 60){
                //TODO: show confimation modal to stop timer if less than 10 minutes
                //alert("You have studied less than 10 minutes, no progress will be saved if you stop now");
                this.setState({openQuickWarningModal: true});
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
                this.setState({openQuickWarningModal: true});
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
            timerStart: new Date().getTime(),
            timerEnd: new Date().getTime(),
        });
    }

    cancelStudySession(){
        this.setState({
            quickWarningVisible: false,
            stopSessionVisible: false,
            timerRunning: false,
        }, () => {
            this.saveTimerDuration({
                timerDirection: this.state.timerDirection,
                timerTitle: this.state.timerTitle,
                timerStart: this.state.timerStart,
                timerEnd: this.state.timerEnd,
                productivityFactor: 0.5,
            });
        });
    }

    saveTimerDuration(timerStopInfo){

        var timePassed = 0;
        var curTime = new Date().getTime();

        if(timerStopInfo.timerDirection === 'down'){
            if(curTime >= timerStopInfo.timerEnd){
                timePassed = (timerStopInfo.timerEnd - timerStopInfo.timerStart) / 1000;
            }
            else{
                timePassed = (curTime - timerStopInfo.timerStart) / 1000;

            }
        }
        else{
            timePassed = (curTime - timerStopInfo.timerStart) / 1000;
        }


        timePassed = timePassed * timerStopInfo.productivityFactor;



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
            todaysObject[timerStopInfo.timerTitle].studied = currentStudyTime + timePassed;
            
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
    openQuickWarning(){
        this.setState({showQuickWarningModal: true});
    }
    openStudyWarning(){
        this.setState({showStudyWarningModal: true});
    }
    hideQuickWarningModal(){
        this.setState({quickWarningVisible: false});
    }
    hideStopSessionModal(){
        this.setState({studyWarningVisible: false});
    }

    ChartHeader(){
        if(this.state.chartSectionVisible){
            return "Track";
        }
        return "(Track)";
    }
    ProjectHeader(){
        if(this.state.projectSectionVisible){
            return "Projects";
        }
        return "(Projects)";
    }

    

    render(){

        //TODO: does this get passed the correct values?
        //TODO: if this does get passed the correct values, does it render the old ones first anyway?
        var preparedChartData = this.prepareChartData(this.state.studyData);





        return(
        <Grid fluid>
            <audio
                id="audio_tickSound30"
                ref="audio_tickSound30"
                src={tickSound}
                type='audio/mpeg; codecs="mp3"'
            />

            <audio
                id="audio_alarmSound"
                ref="audio_alarmSound"
                src={alarmSound}
                type='audio/mpeg; codecs="mp3"'
            />


            <Row className="show-grid">
                <Col xs={12} >
                    <PageHeader>
                        <Button onClick={this.state.callbacks.toggleProjectSectionVisible} className="section-header" bsStyle="link">
                            <h1>{this.ProjectHeader()}</h1>
                        </Button>
                    </PageHeader>
                    {/* There are way too many props being passed around here... is this a bad thing? */}
                    {/* Maybe put them all into an object, and save that object to this.state? then it can
                    be passed directly with any un/re-packing*/}
                    <ProjectSection
                        projectNames={SheetUtil.ProjectNames(this.state.studyData, DateUtil.WeekOfYear())}
                        studyData={this.state.studyData}
                        callbacks={this.state.callbacks}
                        loadedFromRemote={this.state.loadedFromRemote}
                        showStudyWarningModal={this.openStudyWarning}
                        showQuickWarningModal={this.showQuickWarningModal}
                        showEditModal={this.state.showEditModal}
                        showAddModal={this.state.showAddModal}
                        closeAddModal={this.state.callbacks.closeAddModal}
                        showLoadingModal={this.state.showLoadingModal}
                        loadingModalMessage={this.state.loadingModalMessage}
                        editModal_idealGoal={this.state.editModal_idealGoal}
                        editModal_minGoal={this.state.editModal_minGoal}
                        editModal_name={this.state.editModal_name}
                        projectSectionVisible={this.state.projectSectionVisible}
                        timerRunning={this.state.timerRunning}
                    />
                </Col>
            </Row>

            <Row>
                <Col xs={12}>
                    <div className="margin-bottom-md"></div>
                </Col>
            </Row>

            <Row className="show-grid chart-section-col">
                <Col xs={12} >
                    <PageHeader>
                        <Button onClick={this.state.callbacks.toggleChartSectionVisible} className="section-header" bsStyle="link">
                            <h1>{this.ChartHeader()}</h1>
                        </Button>
                    </PageHeader>
                   <ChartSection
                        chartColSize={6}
                        gChartList={preparedChartData.chartList}
                        chartSectionVisible={this.state.chartSectionVisible}
                   />
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
                        timerCurrentTime={this.state.timerTime}
                        timerStart={this.state.timerStart}
                        timerEnd={this.state.timerEnd}
                        timerVolume={this.state.timerVolume}
                        alarmVolume={this.state.alarmVolume}
                        saveTimerDuration={this.saveTimerDuration}
                        openQuickWarning={this.openQuickWarning}
                        openStudyWarning={this.openStudyWarning}
                        cancelStudySession={this.cancelStudySession}
                        closeStudyWarningModal={this.closeStudyWarningModal}
                        showStudyModal={this.state.showStudyModal}
                        startStudySession={this.startStudySession}
                        quickWarningVisible={this.state.quickWarningVisible}
                        stopSessionVisible={this.state.stopSessionVisible}
                        hideQuickWarningModal={this.hideQuickWarningModal}
                        hideStopSessionModal={this.hideStopSessionModal}
                        audio_tickSound30={this.state.audio_tickSound30}
                        audio_alarmSound={this.state.audio_alarmSound}
                        isSignedIn={this.state.isSignedIn}
                    />
                </Col>
            </Row>

            
        </Grid>
        );
    }

}

export default TrackPage;