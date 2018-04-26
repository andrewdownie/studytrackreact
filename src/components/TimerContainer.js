import React, {Component} from 'react';
import Timer from './TimerDisplay';
import QuickWarningModal from './modals/QuickWarningModal';
import StopSessionModal from './modals/StopSessionModal';
import StudyModal from './modals/StudyModal';
import FinishedModal from './modals/FinishedModal';


class TimerContainer extends Component{
    constructor(props){
        super(props);

        var timerCurrentTime = props.timerStartTime;
        if(localStorage.timerRunning != null){
            if(localStorage.timerRunning){
                timerCurrentTime = parseInt(localStorage.timerCurrentTime, 10);
            }
        }


        this.state={
            timerDirection: props.timerDirection,
            timerRunning: props.timerRunning,
            timerTitle: props.timerTitle,
            timerStartTime: props.timerStartTime,
            timerCurrentTime: timerCurrentTime,
            timerStart: props.timerStart,
            timerEnd: props.timerEnd,
            saveTimerDuration: props.saveTimerDuration,
            quickWarningVisible: props.quickWarningVisible,
            stopSessionVisible: props.stopSessionVisible,
            showStudyModal: props.showStudyModal,
            projectNames: [],
            studySession_selectedProject: "Loading projects...",
            studySession_minutes: 30,
            studySession_hours: 0,
            callbacks: {
                //cancelStudySession: this.cancelStudySession.bind(this),//TODO: make this a prop
                cancelStudySession: props.cancelStudySession,
                hideQuickWarningModal: props.hideQuickWarningModal,
                hideStopSessionModal: props.hideStopSessionModal,
                closeStudyModal: this.closeStudyModal.bind(this),
                stopButtonClick: this.stopButtonClick.bind(this),
                settingsButtonClick: this.settingsButtonClick.bind(this),
                startStudySession: props.startStudySession,
            }
        }

        if(localStorage.timerRunning != null){
            if(localStorage.timerRunning){
                this.runTimer();
            }
        }



    }


    hideQuickWarningModal(){
        console.log("hide quick warning modal");
        this.setState({showQuickWarningModal: false});
    }

    hideStopSessionModal(){
        console.log("hide stop session modal");
        this.setState({showStopSessionModal: false});
    }



    componentWillReceiveProps(nextProps){
        var timerWasRunning = this.state.timerRunning;

        if(nextProps.timerRunning === false){
            localStorage.timerTitle = 'no timer running';
            localStorage.timerRunning = false;
            localStorage.timerStartTime = 0;
            localStorage.timerDirection = 'down';
            localStorage.timerCurrentTime = 0;
        }

        //Start the timer this update
        var startTimerNow = false;
        if(this.state.timerRunning === false){
            if(nextProps.timerRunning === true){
                startTimerNow = true;
            }
        }
        else if(this.state.timerDirection !== nextProps.timerDirection){
            startTimerNow = true;
        }

        //TODO: this should get hoisted up to TrackPage or all of this should get brought down...
        var timerStartTime, timerCurrentTime;
        if(startTimerNow){
            timerStartTime = nextProps.timerStartTime;
            timerCurrentTime = nextProps.timerCurrentTime;
        }
        else{
            timerStartTime = this.state.timerStartTime;
            timerCurrentTime = this.state.timerCurrentTime;
        }

        var projectNames = nextProps.projectNames;
        projectNames = projectNames ? projectNames : [];


        this.setState({
            timerDirection: nextProps.timerDirection,
            timerStartTime: timerStartTime,
            timerCurrentTime: timerCurrentTime,
            timerStart: nextProps.timerStart,
            timerEnd: nextProps.timerEnd,
            timerRunning: nextProps.timerRunning,
            timerTitle: nextProps.timerTitle,
            showStudyModal: nextProps.showStudyModal,
            projectNames: projectNames,
            quickWarningVisible: nextProps.quickWarningVisible,
            stopSessionVisible: nextProps.stopSessionVisible,
            //showStudyWarningModal: nextProps.showStudyWarningModal,
        }, ()=>{
            if(startTimerNow){
                if(!timerWasRunning){
                    this.runTimer();
                }

                //TODO save timer settings to local state
                localStorage.timerTitle = this.state.timerTitle;
                localStorage.timerRunning = this.state.timerRunning;
                localStorage.timerStartTime = this.state.timerStartTime;
                localStorage.timerDirection = this.state.timerDirection;
                localStorage.timerCurrentTime = this.state.timerCurrentTime;

                localStorage.timerStart = this.state.timerStart;
                localStorage.timerEnd = this.state.timerEnd;

            }
        });
    }


    closeStudyModal(){
        this.setState({showStudyModal: false});
    }
    /*
    startStudySession(){
        var timerTime = this.state.studySession_hours * 3600 + this.state.studySession_minutes * 60;
        console.log(this.state.studySession_hours);
        console.log(this.state.studySession_minutes);
        console.log(timerTime);

        this.setState({
            timerDirection: 'down',
            timerRunning: true,
            timerTitle: this.state.studySession_selectedProject,
            timerStartTime: timerTime,
            timerCurrentTime: timerTime,
            showStudyModal: false,
        }, ()=>{
            this.runTimer();
        });
        //this.state.startStudySession(studySessionData);
    }
    */

    stopButtonClick(){
        var TEN_MINUTES_IN_MS = 10 * 60 * 1000;
        var timerDirection = this.state.timerDirection;
        var timerStart = this.state.timerStart;
        var timerEnd = this.state.timerEnd;

        var timerStopInfo = {
            timerDirection: timerDirection,
            timerTitle: this.state.timerTitle,
            timerStart: this.state.timerStart,
            timerEnd: this.state.timerEnd,
        }



        if(timerDirection === 'up'){
            if( (new Date().getTime() - timerStart) < TEN_MINUTES_IN_MS){
                this.setState({quickWarningVisible: true});
            }
            else{
                this.state.saveTimerDuration(timerStopInfo);
            }
        }
        else if(timerDirection === 'down'){
            if(new Date().getTime() <= timerEnd){
                this.setState({stopSessionVisible: true});
            }
        }
    }


    settingsButtonClick(){
        console.log("show the settings modal here");
        //TODO: show a modal here...
    }

    runTimer(){
        //console.log(this.state.timerCurrentTime);
        if(this.state.timerRunning){

            setTimeout(function() {
                var dir = 1;
                if(this.state.timerDirection === 'down'){
                    dir = -1;
                    if(new Date().getTime() >= this.state.timerEnd){
                        console.log("TODO: show finished modal here, stop this timer as well...");
                    }
                }
                this.runTimer();
                this.setState({timerCurrentTime: this.state.timerCurrentTime + dir});
            }.bind(this),
            1000);
        }
    }

    //TODO: move this up to track page
    /*
    cancelStudySession(){
        console.log("cancel study session pls...");
        //TODO: do the calculation for how much time should be saved to the sheet
        var timePassed = 0;


        //var timeToAddToSheet = Math.ceil(timerTime / 2);
        if(this.state.timerDirection === 'down'){
            timePassed = this.state.timerStartTime - this.state.timerCurrentTime;
        }
        else if(this.state.timerDirection === 'up'){
            timePassed = this.state.timerCurrentTime;
        }

        this.state.cancelStudySession(timePassed);
        this.setState({
            showStudyWarningModal: false,
            showQuickWarningModal: false,
            timerRunning: false,
            timerDirection: '',
            timerStartTime: 0,
        });
    }
    */

    timerModals(){
        return(
            <div>
                <QuickWarningModal
                    callbacks={this.state.callbacks}
                    quickWarningVisible={this.state.quickWarningVisible}
                />
                <StopSessionModal
                    callbacks={this.state.callbacks}
                    stopSessionVisible={this.state.stopSessionVisible}
                />
                <StudyModal
                    callbacks={this.state.callbacks}
                    projectNames={this.state.projectNames}
                    showStudyModal={this.state.showStudyModal}
                />
                <FinishedModal
                />
            </div>
        );
    }

    timer(){
        if(this.state.timerRunning){
            return(
                <Timer
                    callbacks={this.state.callbacks}
                    timerCurrentTime={this.state.timerCurrentTime}
                    timerStart={this.state.timerStart}
                    timerEnd={this.state.timerEnd}
                    timerDirection={this.state.timerDirection}
                    timerTitle={this.state.timerTitle}
                />
            );
        }
    }


    render(){
        return (
            <div>
                {this.timer()}
                {this.timerModals()}
            </div>
        );
    }
}

export default TimerContainer;