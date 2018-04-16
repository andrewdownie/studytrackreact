import React, {Component} from 'react';
import Timer from './TimerDisplay';
import QuickWarningModal from './modals/QuickWarningModal';
import StopSessionModal from './modals/StopSessionModal';
import StudyModal from './modals/StudyModal';


class TimerContainer extends Component{
    constructor(props){
        super(props);


        this.state={
            timerDirection: props.timerDirection,
            timerRunning: props.timerRunning,
            timerTitle: props.timerTitle,
            timerStartTime: props.timerStartTime,
            timerCurrentTime: props.timerStartTime,
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

        //Start the timer this update
        var startTimerNow = false;
        if(this.state.timerRunning === false){
            if(nextProps.timerRunning === true){
                startTimerNow = true;
            }
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

        console.log(nextProps.showStudyModal);

        this.setState({
            timerDirection: nextProps.timerDirection,
            timerStartTime: timerStartTime,
            timerCurrentTime: timerCurrentTime,
            timerRunning: nextProps.timerRunning,
            timerTitle: nextProps.timerTitle,
            showStudyModal: nextProps.showStudyModal,
            projectNames: projectNames,
            quickWarningVisible: nextProps.quickWarningVisible,
            stopSessionVisible: nextProps.stopSessionVisible,
            //showStudyWarningModal: nextProps.showStudyWarningModal,
        }, ()=>{
            if(startTimerNow){
                this.runTimer();
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
        console.log("stop button click");
        console.log("how come the modal doesn't get shown here?");
        var timerDirection = this.state.timerDirection;
        var timerTime = this.state.timerCurrentTime;

        var timerStopInfo = {
            timerDirection: this.state.timerDirection,
            timerTitle: this.state.timerTitle,
        }



        if(timerDirection === 'up'){
            timerStopInfo.timerTime = this.state.timerCurrentTime;
            if(timerTime < 60 * 10){
                this.setState({quickWarningVisible: true});
            }
            else{
                this.state.saveTimerDuration(timerStopInfo);
            }
        }
        else if(timerDirection === 'down'){
            timerStopInfo.timerTime = this.state.timerStartTime;
            if(timerTime > 0){
                this.setState({stopSessionVisible: true});
            }
        }
    }


    settingsButtonClick(){
        console.log("show the settings modal here");
        //TODO: show a modal here...
    }

    runTimer(){
        console.log(this.state.timerCurrentTime);
        if(this.state.timerRunning){
            var dir = 1;
            if(this.state.timerDirection === 'down'){
                dir = -1;
            }


            setTimeout(function() {
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
            </div>
        );
    }


    render(){
        if(!this.state.timerRunning){
            return this.timerModals();
        }
        return (
            <div>
                <Timer
                    callbacks={this.state.callbacks}
                    timerCurrentTime={this.state.timerCurrentTime}
                    timerTitle={this.state.timerTitle}
                />
                {this.timerModals()}
            </div>
        );
    }
}

export default TimerContainer;