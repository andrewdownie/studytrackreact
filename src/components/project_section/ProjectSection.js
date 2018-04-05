/* Imports */
import {Modal, Button} from 'react-bootstrap';
import React, {Component} from 'react';
import FaSpinner from 'react-icons/lib/fa/spinner';

/* Component Imports */
import ProjectButtonsWrapper from './ProjectButtonsWrapper';
import ProjectList from './ProjectList';



class ProjectSection extends Component {
    constructor(props){
        super(props);
        this.state = {
            callbacks: props.callbacks,
            noProjectsFound: this.noProjectsFound(props),
            loadedFromRemote: props.loadedFromRemote,
            showEditModal: false,
            showAddModal: false,
            editModal_name: "",
            editModal_minGoal: 0,
            editModal_idealGoal: 0,
            showLoadingModal: false,
            loadingModalMessage: "",
            //TODO: I have two sets of edit modal/project info
            addProject_name: "",
            addProject_minGoal: 2,
            addProject_idealGoal: 5,
        };

        this.deleteProjectPassthru = this.deleteProjectPassthru.bind(this);
        this.editProjectPassthru = this.editProjectPassthru.bind(this);
        this.openEditModal = this.openEditModal.bind(this);
        this.closeEditModal = this.closeEditModal.bind(this);
        this.addProject = this.addProject.bind(this);
    }

    addProject(){
        this.state.callbacks.addProject({
            title: this.state.addProject_name,
            minGoal: this.state.addProject_minGoal,
            idealGoal: this.state.addProject_idealGoal,
        });
    }

    noProjectsFound(props){
        var noProjectsFound;

        if(props.projectNames){
            noProjectsFound = props.projectNames.length === 0 && props.loadedFromRemote;
        }
        else{
            noProjectsFound = true;
        }

        return noProjectsFound;
    }

    componentWillReceiveProps(nextProps){
        var editModal_originalName = "";
        if(nextProps.showEditModal){
            editModal_originalName = nextProps.editModal_name;
        }
        this.setState({
            noProjectsFound: this.noProjectsFound(nextProps),
            loadedFromRemote: nextProps.loadedFromRemote,
            projectNames: nextProps.projectNames,
            showEditModal: nextProps.showEditModal,
            showAddModal: nextProps.showAddModal,
            closeAddModal: nextProps.closeAddModal,
            editModal_name: nextProps.editProject_name, //TODO: rename editModal_name to editModal_newName
            editModal_minGoal: nextProps.editProject_minGoal,
            editModal_idealGoal: nextProps.editProject_idealGoal,
            showLoadingModal: nextProps.showLoadingModal,
            loadingModalMessage: nextProps.loadingModalMessage,
            editProject_name: "",
            addProject_originalName: "",
            addProject_minGoal: 2,
            addProject_idealGoal: 5,
        });
    }

    openEditModal(projectName){
        //TODO: get the info about the selected project...
        //TODO: how?
        //TODO: this has to get moved up to track page...

        /*
        var woy = DateUtil.WeekOfYear();

        var projectGoals = this.state.studyData[woy - 1][0][projectName];
        this.setState({
            showEditProject: true,
            editProject_name: projectName,
            editProject_minGoal: projectGoals.minGoal,
            editProject_idealGoal: projectGoals.idealGoal,
        });
        */
    }
    closeEditModal(){
        this.setState({showEditProject: false});
    }

    deleteProjectPassthru() {
        this.state.callbacks.deleteProject(this.state.editModal_name);
    }
    editProjectPassthru() {
        var newProjectInfo = {};
        newProjectInfo.newName = this.state.editModal_name;
        newProjectInfo.originalName = this.state.editModal_originalName;
        newProjectInfo.minGoal = this.state.editModal_minGoal;
        newProjectInfo.idealGoal = this.state.editModal_idealGoal;
        this.state.callbacks.editProject(newProjectInfo);
    }

    render(){
        return(
            <div className="show-grid project-section">
                <ProjectButtonsWrapper
                    callbacks={this.state.callbacks}
                    highlightAddProjectButton={this.state.noProjectsFound}
                />
                <ProjectList
                    callbacks={this.state.callbacks}
                    loadedFromRemote={this.state.loadedFromRemote}
                    noProjectsFound={this.state.noProjectsFound}
                    projectNames={this.state.projectNames}
                />

                {/* EDIT PROJECT MODAL */}
                <Modal show={this.state.showEditModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit project</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <h5>Title</h5>
                        <input
                            type="text"
                            className="form-control"
                            value={this.state.editModal_name}
                            onChange={(event) => {this.setState({editModal_name: event.target.value})}}
                        />
                        <h5>Minimum Weekly Goal (hours)</h5>
                        <input
                            type="number"
                            className="form-control"
                            value={this.state.editModal_minGoal}
                            onChange={(event) => {this.setState({editModal_minGoal: event.target.value})}}
                        />
                        <h5>Ideal Weekly Goal (hours)</h5>
                        <input
                            type="number"
                            className="form-control"
                            value={this.state.editModal_idealGoal}
                            onChange={(event) => {this.setState({editModal_idealGoal: event.target.value})}}
                        />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button bsStyle="danger" onClick={this.deleteProjectPassthru} className="pull-left">Delete</Button>
                        <Button onClick={this.state.callbacks.closeEditModal}>Cancel</Button>
                        <Button bsStyle="primary" onClick={this.editProjectPassthru}>Save Changes</Button>
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

                {/* ADD PROJECT MODAL */}
                <Modal show={this.state.showAddModal}>
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
                        <Button onClick={this.state.closeAddModal}>Cancel</Button>
                        <Button bsStyle="primary" onClick={this.addProject}>Add Project</Button>
                    </Modal.Footer>
                </Modal>

            </div>
        );
    }
}

export default ProjectSection;