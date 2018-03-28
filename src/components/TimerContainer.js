import {DropdownButton, Modal, Button, Navbar, Nav, NavItem, MenuItem, NavDropdown} from 'react-bootstrap';
import React, {Component} from 'react';
import Timer from './TimerDisplay';


class TimerContainer extends Component{
    constructor(props){
        super(props);

        this.state={
            timerDirection: props.timerDirection,
            timerRunning: props.timerRunning,
            timerTitle: props.timerTitle,
            timerStartTime: props.timerStartTime,
            timerCurrentTime: 0,
            saveTimerDuration: props.saveTimerDuration,
            showQuickWarning: props.showQuickWarning,
            showStudyWarning: props.showStudyWarning,
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
        }


        this.stopButtonClick = this.stopButtonClick.bind(this);
        this.cancelStudySession = this.cancelStudySession.bind(this);
        this.closeStudyModal = this.closeStudyModal.bind(this);
        this.startStudySession = this.startStudySession.bind(this);
    }




    componentWillReceiveProps(nextProps){
        if(nextProps.projectNames && nextProps.projectNames.length > 0 && this.state.studySession_selectedProject == "Loading projects..."){
            this.state.studySession_selectedProject = nextProps.projectNames[0];
        }

        //Start the timer this update
        var startTimerNow = false;
        if(this.state.timerRunning === false){
            if(nextProps.timerRunning === true){
                console.log("Start timer now");//TODO: this doesn't run when starting a study session?
                startTimerNow = true;
            }
        }

        console.log("Timer show study modal now pls: " + nextProps.showStudyModal);


        console.log(nextProps.timerRunning);
        console.log(nextProps.timerDirection);
        console.log(nextProps.timerStartTime);


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
            //showStudyWarningModal: nextProps.showStudyWarningModal,
        }, ()=>{
            if(startTimerNow){
                currentTime: this.state.timerStartTime;
                console.log("start timer now");
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
        console.log("(Study session time), hours: " + this.state.studySession_hours + ", minutes: " + this.state.studySession_minutes);
        var timerTime = this.state.studySession_hours * 3600 + this.state.studySession_minutes * 60;
        console.log(timerTime);

        var studySessionData = {
            timerDirection: 'down',
            timerRunning: true,
            timerTitle: this.state.studySession_selectedProject,
            timerTime: timerTime,
        };
        this.state.startStudySession(studySessionData);
    }

    stopButtonClick(){
        var timerDirection = this.state.timerDirection;
        var timerTitle = this.state.timerTitle;
        var timerTime = this.state.timerCurrentTime;

        var timerStopInfo = {
            timerDirection: this.state.timerDirection,
            timerTitle: this.state.timerTitle,
        }



        if(timerDirection == 'up'){
            timerStopInfo.timerTime = this.state.timerCurrentTime;
            if(timerTime < 60 * 10){
                //this.state.showQuickWarning();
                this.setState({showQuickWarningModal: true});
            }
            else{
                this.state.saveTimerDuration(timerStopInfo);
            }
        }
        else if(timerDirection == 'down'){
            timerStopInfo.timerTime = this.state.timerStartTime;
            console.log("MOOOOOOOOOOOEEEEEEEEEEEEEEEEEEEEEEEEEWWWWWWWWWWWWW");
            if(timerTime > 0){
                console.log("show the fractional modal");
                //this.state.showStudyWarning();
                this.setState({showStudyWarningModal: true});
            }
            //TODO: if (timerTime > 0){ show fractional modal; }
            //TODO: will there need to be an active check to see when a study session ends?
            //TODO: what happens when teh user presses the stop button in a full weight study session?
            //TODO: fractional amount of time right?
            //TODO: need to show warning
        }
    }


    timerSettings(){
        console.log("this is timer settings");
        //TODO: show a modal here...
    }

    runTimer(){
        if(this.state.timerRunning){
            var dir = 1;
            if(this.state.timerDirection === 'down'){
                dir = -1;
            }

            console.log("run timer");

            setTimeout(function() {
                console.log("set timer state");
                this.runTimer();
                this.setState({timerCurrentTime: this.state.timerCurrentTime + dir});
            }.bind(this),
            1000);
        }
    }

    timerModals(){
        return(
            <div>
                {/* STUDY SESSION WARNING MODAL */}
                <Modal show={this.state.showStudyWarningModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>WARNING! Timer not done yet</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div>
                            If you cancel the timer now, only 50% of the timer you've studied will be recorded.
                            If you want 100% of your study time this session to be recored, then continue Studying
                            until the timer ends, and  considering setting a shorter timer next time.
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button bsStyle="danger" onClick={this.cancelStudySession}>Cancel Session</Button>
                        <Button bsStyle="default" onClick={() => {this.setState({showStudyWarningModal: false})} }>Continue Session</Button>
                    </Modal.Footer>
                </Modal>

                {/* 10 MINUTE WARNING MODAL */}
                <Modal show={this.state.showQuickWarningModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Warning!</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>
                            You have studied for less than 10 minutes this quick study session.
                            If you cancel now only half of your study time will be recorded.
                            If you would like to have 100% of your study time recorded, study for 
                            at least 10 minutes.
                        </p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.cancelStudySession} bsStyle="danger">Cancel Anyway</Button>
                        <Button onClick={() => {this.setState({showQuickWarningModal: false})}}>Keep Studying</Button>
                    </Modal.Footer>
                </Modal>

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
        //TODO: do the calculation for how much time should be saved to the sheet
        var timePassed = 0;


        //var timeToAddToSheet = Math.ceil(timerTime / 2);
        if(this.state.timerDirection == 'down'){
            timePassed = this.state.timerStartTime - this.state.timerCurrentTime;
        }
        else if(this.state.timerDirection == 'up'){
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
        console.log("This is timer render");
        console.log(this.state.showStudyModal);
        if(!this.state.timerRunning){
            return <div>{this.timerModals()}</div>;
        }
        return (
            <div>
                <Timer
                    timerCurrentTime={this.state.timerCurrentTime}
                    timerTitle={this.state.timerTitle}
                    stopButtonClick={this.state.stopButtonClick}
                    timerSettings={this.state.timerSettings}
                />
                {this.timerModals()}
            </div>
        );
    }
}

export default TimerContainer;