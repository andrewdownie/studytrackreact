import {DropdownButton, Modal, Button, MenuItem} from 'react-bootstrap';
import React, {Component} from 'react';
import Timer from './TimerDisplay';
import QuickWarningModal from './modals/QuickWarningModal';
import StopSessionModal from './modals/StopSessionModal';


class TimerContainer extends Component{
    constructor(props){
        super(props);

        /* Bindings */
        this.stopButtonClick = this.stopButtonClick.bind(this);
        this.cancelStudySession = this.cancelStudySession.bind(this);
        this.closeStudyModal = this.closeStudyModal.bind(this);
        this.startStudySession = this.startStudySession.bind(this);

        this.state={
            timerDirection: props.timerDirection,
            timerRunning: props.timerRunning,
            timerTitle: props.timerTitle,
            timerStartTime: props.timerStartTime,
            timerCurrentTime: 0,
            saveTimerDuration: props.saveTimerDuration,
            showQuickWarning: props.showQuickWarning,
            showStopSession: props.showStopSession,
            cancelStudySession: props.cancelStudySession,
            showStudyModal: props.showStudyModal,
            //closeStudyWarningModal: props.closeStudyWarningModal,
            //showStudyWarningModal: props.showStudyWarningModal,
            showStudyWarningModal: false,
            showQuickWarningModal: false,
            projectNames: [],
            studySession_selectedProject: "Loading projects...",
            studySession_minutes: 30,
            studySession_hours: 0,
            startStudySession: props.startStudySession,
            callbacks: {
                cancelStudySession: this.cancelStudySession,
                hideQuickWarningModal: this.hideQuickWarningModal.bind(this),
                hideStopSessionModal: this.hideStopSessionModal.bind(this),
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
        var selectedProject = this.state.studySession_selectedProject;
        if(nextProps.projectNames && nextProps.projectNames.length > 0 && this.state.studySession_selectedProject === "Loading projects..."){
            //this.state.studySession_selectedProject = nextProps.projectNames[0];
            selectedProject = nextProps.projectNames[0];
        }

        //Start the timer this update
        var startTimerNow = false;
        if(this.state.timerRunning === false){
            if(nextProps.timerRunning === true){
                startTimerNow = true;
            }
        }

        var projectNames = nextProps.projectNames;
        projectNames = projectNames ? projectNames : [];


        this.setState({
            timerDirection: nextProps.timerDirection,
            timerStartTime: nextProps.timerStartTime,
            timerCurrentTime: nextProps.timerStartTime,
            timerRunning: nextProps.timerRunning,
            timerTitle: nextProps.timerTitle,
            showStudyModal: nextProps.showStudyModal,
            projectNames: projectNames,
            studySession_selectedProject: selectedProject,
            //showStudyWarningModal: nextProps.showStudyWarningModal,
        }, ()=>{
            if(startTimerNow){
                this.runTimer();
            }
        });
    }

    changeSelectedStudySessionProject(projectTitle){
        this.setState({studySession_selectedProject: projectTitle});
    }

    closeStudyModal(){
        this.setState({showStudyModal: false});
    }
    startStudySession(){
        var timerTime = this.state.studySession_hours * 3600 + this.state.studySession_minutes * 60;
        console.log(this.state.studySession_hours);
        console.log(this.state.studySession_minutes);
        console.log(timerTime);

        /*
        var studySessionData = {
            timerDirection: 'down',
            timerRunning: true,
            timerTitle: this.state.studySession_selectedProject,
            timerTime: timerTime,
        };
        */
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

    stopButtonClick(){
        console.log("stop button click");
        var timerDirection = this.state.timerDirection;
        var timerTime = this.state.timerCurrentTime;

        var timerStopInfo = {
            timerDirection: this.state.timerDirection,
            timerTitle: this.state.timerTitle,
        }



        if(timerDirection === 'up'){
            timerStopInfo.timerTime = this.state.timerCurrentTime;
            if(timerTime < 60 * 10){
                //this.state.showQuickWarning();
                this.setState({showQuickWarningModal: true});
            }
            else{
                this.state.saveTimerDuration(timerStopInfo);
            }
        }
        else if(timerDirection === 'down'){
            timerStopInfo.timerTime = this.state.timerStartTime;
            if(timerTime > 0){
                //this.state.showStudyWarning();
                this.setState({showStopSessionModal: true});
            }
            //TODO: if (timerTime > 0){ show fractional modal; }
            //TODO: will there need to be an active check to see when a study session ends?
            //TODO: what happens when teh user presses the stop button in a full weight study session?
            //TODO: fractional amount of time right?
            //TODO: need to show warning
        }
    }


    timerSettings(){
        //TODO: show a modal here...
    }

    runTimer(){
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

    timerModals(){
        return(
            <div>


                {/* STUDY SESSION MODAL */}
                <Modal show={this.state.showStudyModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Start a Study Session</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <h4>Project</h4>
                        <DropdownButton
                            title={this.state.studySession_selectedProject}
                            key={1}
                            id={`dropdown-basic-${1}`}
                        >
                            {
                                this.state.projectNames.map( (projectName, i) => {
                                    return (
                                        <MenuItem key={i} onClick={this.changeSelectedStudySessionProject.bind(this, projectName)} eventKey={i}>{projectName}</MenuItem>
                                    )
                                })
                            }
                        </DropdownButton>
                        <h4>Duration</h4>
                        <div>
                            <p>Hours</p>
                            <input
                                type="number"
                                className="form-control"
                                value={this.state.studySession_hours}
                                onChange={(event) => {this.setState({studySession_hours: event.target.value})}}
                                min="0"
                                max="12"
                            />
                        </div>
                        <div>
                            <p>Minutes</p>
                            <input
                                type="number"
                                className="form-control"
                                value={this.state.studySession_minutes}
                                onChange={(event) => {this.setState({studySession_minutes: event.target.value})}}
                                min="0"
                                max="59"
                            />
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.closeStudyModal}>Cancel</Button>
                        <Button bsStyle="primary" onClick={this.startStudySession}>Start</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }


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


    render(){
        if(!this.state.timerRunning){
            return <div>{this.timerModals()}</div>;
        }
        return (
            <div>
                <Timer
                    timerCurrentTime={this.state.timerCurrentTime}
                    timerTitle={this.state.timerTitle}
                    stopButtonClick={this.stopButtonClick}
                    timerSettings={this.state.timerSettings}
                />
                {this.timerModals()}
                <QuickWarningModal
                    callbacks={this.state.callbacks}
                    showQuickWarningModal={this.state.showQuickWarningModal}
                />
                <StopSessionModal
                    callbacks={this.state.callbacks}
                    showStopSessionModal={this.state.showStopSessionModal}
                />
            </div>
        );
    }
}

export default TimerContainer;