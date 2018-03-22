import {Modal, Button, OverlayTrigger, DropdownButton, MenuItem} from 'react-bootstrap';
import FaSpinner from 'react-icons/lib/fa/spinner';
import React, {Component} from 'react';


class ProjectModals extends Component{
    constructor(props){
        super(props);


        this.state = { //NOTE: be sure to update componentWillRecieveProps as well
            //show: props.showAddProject
            studySession_selectedProject: "Loading projects...",
            studySession_minutes: 30,
            studySession_hours: 0,
            startStudySession: props.startStudySession,
            showAddProject: props.showAddProject,
            showEditProject: props.showEditProject,
            showStudyModal: props.showStudyModal,
            showLoadingModal: props.showLoadingModal,
            showQuickWarningModal: props.showQuickWarningModal,
            showStudyWarningModal: props.showStudyWarningModal,
            addProjectCallback: props.addProjectCallback,
            loadingModalMessage: props.loadingModalMessage,
            editProjectCallback: props.editProjectCallback,
            deleteProjectCallback: props.deleteProjectCallback,
            cancelStudySession: props.cancelStudySession,
            closeModals: props.closeModals,
            addProject_name: "",
            addProject_minGoal: 2,
            addProject_idealGoal: 5,
            editProject_name: "",
            editProject_originalName: "",
            editProject_minGoal: 2,
            editProject_idealGoal: 5,
            projectNames: [],
        };

        this.startStudySession = this.startStudySession.bind(this);
        this.deleteProject = this.deleteProject.bind(this);
        this.editProject = this.editProject.bind(this);
        this.addProject = this.addProject.bind(this);

    }

    //TODO: this will be called even when the props havent changed, need to check to see if they've changed or not?
    componentWillReceiveProps(nextProps){

        if(nextProps.projectNames && nextProps.projectNames.length > 0 && this.state.studySession_selectedProject == "Loading projects..."){
            this.state.studySession_selectedProject = nextProps.projectNames[0];
        }

        var newProjectNames = nextProps.projectNames;
        if(newProjectNames === null){
            newProjectNames = [];
        }

        //TODO: do I need to set get the studySession minutes/hours? I don't think so, it's gonna be two way bound, and then shipped when the user presses the final enter button
        this.setState({
            loadingModalMessage: nextProps.loadingModalMessage,
            showEditProject: nextProps.showEditProject,
            showLoadingModal: nextProps.showLoadingModal,
            showAddProject: nextProps.showAddProject,
            showStudyModal: nextProps.showStudyModal,
            showQuickWarningModal: nextProps.showQuickWarningModal,
            showStudyWarningModal: nextProps.showStudyWarningModal,
            addProjectCallback: nextProps.addProjectCallback,
            editProject_name: nextProps.editProject_name,
            editProject_originalName: nextProps.editProject_name,
            editProject_minGoal: nextProps.editProject_minGoal,
            editProject_idealGoal: nextProps.editProject_idealGoal,
            projectNames: newProjectNames,
            startStudySession: nextProps.startStudySession,
        });
    }


    addProject(){
        this.state.addProjectCallback({
            title: this.state.addProject_name,
            minGoal: this.state.addProject_minGoal,
            idealGoal: this.state.addProject_idealGoal,
        });
    }
    editProject(){
        //TODO: when the user clicks the edit button, it needs to fill in the details for that project...
        
        var newName = this.state.editProject_name;
        var originalName = this.state.editProject_originalName;
        var minGoal = this.state.editProject_minGoal;
        var idealGoal = this.state.editProject_idealGoal;
        this.state.editProjectCallback({newName, originalName, minGoal, idealGoal});
    }
    deleteProject(){
        var deleteProjectData = {};
        deleteProjectData.targetName = this.state.editProject_name;
        this.state.deleteProjectCallback(deleteProjectData);
    }
    changeSelectedStudySessionProject(projectTitle){
        this.setState({studySession_selectedProject: projectTitle});
    }

    startStudySession(){
        var studySessionData = {
            timerDirection: 'down',
            timerRunning: true,
            timerTitle: this.state.studySession_selectedProject,
            timerTime: this.state.studySession_hours * 3600 + this.state.studySession_minutes * 60,
        };
        this.state.startStudySession(studySessionData);
    }
    

    render(){
        return(
            <div>
                {/* ADD PROJECT MODAL */}
                <Modal show={this.state.showAddProject}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add a project</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <h5>Title</h5>
                        <input
                            type="text"
                            className="form-control"
                            value={this.state.addProject_name}
                            onChange={(event) => {this.setState({addProject_name: event.target.value})}}
                        />
                        <h5>Minimum Weekly Goal (hours)</h5>
                        <input
                            type="number"
                            className="form-control"
                            value={this.state.addProject_minGoal}
                            onChange={(event) => {this.setState({addProject_minGoal: event.target.value})}}
                        />
                        <h5>Ideal Weekly Goal (hours)</h5>
                        <input
                            type="number"
                            className="form-control"
                            value={this.state.addProject_idealGoal}
                            onChange={(event) => {this.setState({addProject_idealGoal: event.target.value})}}
                        />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.state.closeModals.closeAddModal}>Cancel</Button>
                        <Button bsStyle="primary" onClick={this.addProject}>Add Project</Button>
                    </Modal.Footer>
                </Modal>

                {/* EDIT PROJECT MODAL */}
                <Modal show={this.state.showEditProject}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit project</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <h5>Title</h5>
                        <input
                            type="text"
                            className="form-control"
                            value={this.state.editProject_name}
                            onChange={(event) => {this.setState({editProject_name: event.target.value})}}
                        />
                        <h5>Minimum Weekly Goal (hours)</h5>
                        <input
                            type="number"
                            className="form-control"
                            value={this.state.editProject_minGoal}
                            onChange={(event) => {this.setState({editProject_minGoal: event.target.value})}}
                        />
                        <h5>Ideal Weekly Goal (hours)</h5>
                        <input
                            type="number"
                            className="form-control"
                            value={this.state.editProject_idealGoal}
                            onChange={(event) => {this.setState({editProject_idealGoal: event.target.value})}}
                        />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button bsStyle="danger" onClick={this.deleteProject} className="pull-left">Delete</Button>
                        <Button onClick={this.state.closeModals.closeEditModal}>Cancel</Button>
                        <Button bsStyle="primary" onClick={this.editProject}>Save Changes</Button>
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
                        <Button onClick={this.state.closeModals.closeStudyModal}>Cancel</Button>
                        <Button bsStyle="primary" onClick={this.startStudySession}>Start</Button>
                    </Modal.Footer>
                </Modal>

                {/* 10 MINUTE WARNING MODAL */}
                <Modal show={this.state.showQuickWarningModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Warning!</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>
                            You have studied for less than 10 minutes this quick study session. If you cancel now zero time will be recorded.
                        </p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={() => {this.state.cancelStudySession(0)}} bsStyle="danger">Cancel Anyway</Button>
                        <Button onClick={this.state.closeModals.closeWarningModal}>Keep Studying</Button>
                    </Modal.Footer>
                </Modal>

                {/* LOADING MODAL */}
                <div className="loading-modal-container">
                    <Modal show={this.state.showLoadingModal} className="loading-modal">
                        <Modal.Body>
                            <h2><FaSpinner className="spin"/> {this.state.loadingModalMessage}</h2>
                        </Modal.Body>
                    </Modal>
                </div>


            </div>
        );
    }
}

export default ProjectModals;