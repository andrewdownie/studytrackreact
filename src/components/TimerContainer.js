import QuickWarningModal from './modals/QuickWarningModal';
import StopSessionModal from './modals/StopSessionModal';
import FinishedModal from './modals/FinishedModal';
import SettingsModal from './modals/SettingsModal';
import StudyModal from './modals/StudyModal';
import React, {Component} from 'react';
import Timer from './TimerDisplay';


class TimerContainer extends Component{
    constructor(props){
        super(props);



        this.hideSettingsModal = this.hideSettingsModal.bind(this);

        var timerCurrentTime = props.timerStartTime;
        if(localStorage.timerRunning != null){
            if(localStorage.timerRunning){
                timerCurrentTime = parseInt(localStorage.timerCurrentTime, 10);
            }
        }

        this.completeTimer = this.completeTimer.bind(this);

        // if(tickSound30 == null){
            // var tickSound30 = this.refs.audio_tickSound30;
            // console.log(tickSound30);
            // tickSound30.addEventListener('ended', function() {
            //     this.currentTime = 0;
            //     this.play();
            // }, false);
        // }


        this.state={
            timerDirection: props.timerDirection,
            timerRunning: props.timerRunning,
            timerTitle: props.timerTitle,
            timerStartTime: props.timerStartTime,
            timerCurrentTime: timerCurrentTime,
            timerStart: props.timerStart,
            timerEnd: props.timerEnd,
            timerVolume: props.timerVolume,
            saveTimerDuration: props.saveTimerDuration,
            quickWarningVisible: props.quickWarningVisible,
            stopSessionVisible: props.stopSessionVisible,
            showStudyModal: props.showStudyModal,
            projectNames: [],
            studySession_selectedProject: "Loading projects...",
            studySession_minutes: 30,
            studySession_hours: 0,
            finishedModalVisible: false,
            settingsModalVisible: false,
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

    completeTimer(productivityFactor){
        console.log("This is complete timer in timer container");
        //TODO: call completeTimer here with timer info in an object passed as an arg
        this.state.saveTimerDuration({
            timerDirection: 'down',
            timerEnd: this.state.timerEnd,
            timerStart: this.state.timerStart,
            timerTitle: this.state.timerTitle,
            productivityFactor: productivityFactor,
        });
        this.setState({finishedModalVisible: false});
    }

    hideQuickWarningModal(){
        console.log("hide quick warning modal");
        this.setState({showQuickWarningModal: false});
    }

    hideStopSessionModal(){
        console.log("hide stop session modal");
        this.setState({showStopSessionModal: false});
    }

    hideSettingsModal(timerVolume){
        console.log("Timer volume has been set to: " + timerVolume);
        this.state.audio_tickSound30.volume = timerVolume;
        this.state.audio_alarmSound.volume = timerVolume;
        this.setState({settingsModalVisible: false, timerVolume});
    }



    componentWillReceiveProps(nextProps){
        var timerWasRunning = this.state.timerRunning;

        if(nextProps.timerRunning){
            if(nextProps.audio_tickSound30.paused){
                nextProps.audio_tickSound30.play();
            }
        }
        else{
            nextProps.audio_tickSound30.pause();
        }


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
            timerVolume: nextProps.timerVolume,
            showStudyModal: nextProps.showStudyModal,
            projectNames: projectNames,
            quickWarningVisible: nextProps.quickWarningVisible,
            stopSessionVisible: nextProps.stopSessionVisible,
            audio_tickSound30: nextProps.audio_tickSound30,
            audio_alarmSound: nextProps.audio_alarmSound,
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
        //TODO: need to handle productivity factor ---------------------------------------

        var TEN_MINUTES_IN_MS = 10 * 60 * 1000;
        var timerDirection = this.state.timerDirection;
        var timerStart = this.state.timerStart;
        var timerEnd = this.state.timerEnd;
        var productivityFactor = 1;

        var timerStopInfo = {
            productivityFactor: productivityFactor,
            timerTitle: this.state.timerTitle,
            timerStart: this.state.timerStart,
            timerDirection: timerDirection,
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
        this.setState({settingsModalVisible: true});
    }


    runTimer(){

        if(this.state.timerRunning){
            setTimeout(function() {
                var dir = 1;
                if(this.state.timerDirection === 'down'){
                    dir = -1;
                    if(new Date().getTime() >= this.state.timerEnd){
                        console.log("TODO: show finished modal here, stop this timer as well...");
                        this.state.audio_tickSound30.pause();
                        this.state.audio_alarmSound.play();

                        this.setState({
                            finishedModalVisible: true,
                            timerRunning: false,
                            //TODO: clear local storage for timer
                        })
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
                    completeTimer={this.completeTimer}
                    finishedModalVisible={this.state.finishedModalVisible}
                />
                <SettingsModal
                    settingsModalVisible={this.state.settingsModalVisible}
                    hideSettingsModal={this.hideSettingsModal}
                    timerVolume={this.state.timerVolume}
                />
            </div>
        );
    }

    timer(){
        if(this.state.timerRunning){
            return(
                <div>
                    <Timer
                        callbacks={this.state.callbacks}
                        timerCurrentTime={this.state.timerCurrentTime}
                        timerStart={this.state.timerStart}
                        timerEnd={this.state.timerEnd}
                        timerDirection={this.state.timerDirection}
                        timerTitle={this.state.timerTitle}
                    />
                </div>
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