
import {DropdownButton, Modal, Button, MenuItem} from 'react-bootstrap';
import React, {Component} from 'react';

class StudyModal extends Component{
    constructor(props){
        super(props);

        this.startStudySessionPassthru = this.startStudySessionPassthru.bind(this);
        this.state = {
            callbacks: props.callbacks,
            projectNames: [],
            selectedProject: "Loading projects...",
            minutes: 30,
            hours: 0,
        };
    }

    componentWillReceiveProps(nextProps){
        var selectedProject = this.state.selectedProject;
        if(nextProps.projectNames && nextProps.projectNames.length > 0 && this.state.selectedProject === "Loading projects..."){
            //this.state.selectedProject = nextProps.projectNames[0];
            selectedProject = nextProps.projectNames[0];
        }

        this.setState({
            projectNames: nextProps.projectNames,
            showStudyModal: nextProps.showStudyModal,
            selectedProject: selectedProject,
            minutes: 30,
            hours: 0,
        });
    }

    changeSelectedStudySessionProject(projectTitle){
        this.setState({selectedProject: projectTitle});
    }

    startStudySessionPassthru(){
        console.log("start study session");
        var sessionData = {
            timerDirection: 'down',
            timerRunning: true,
            timerTitle: this.state.selectedProject,
            timerTime: this.state.hours * 3600 + this.state.minutes * 60,
        };
        this.state.callbacks.startStudySession(sessionData);
    }

    render(){
        return(
            /* STUDY SESSION MODAL */
            <Modal show={this.state.showStudyModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Start a Study Session</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h4>Project</h4>
                    <DropdownButton
                        title={this.state.selectedProject}
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
                            value={this.state.hours}
                            onChange={(event) => {this.setState({hours: event.target.value})}}
                            min="0"
                            max="12"
                        />
                    </div>
                    <div>
                        <p>Minutes</p>
                        <input
                            type="number"
                            className="form-control"
                            value={this.state.minutes}
                            onChange={(event) => {this.setState({minutes: event.target.value})}}
                            min="0"
                            max="59"
                        />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.state.callbacks.closeStudyModal}>Cancel</Button>
                    <Button bsStyle="primary" onClick={this.startStudySessionPassthru}>Start</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default StudyModal;