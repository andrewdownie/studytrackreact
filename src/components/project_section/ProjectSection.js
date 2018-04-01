/* Imports */
import {Modal, Button} from 'react-bootstrap';
import React, {Component} from 'react';

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
            editModal_name: "",
            editModal_minGoal: 0,
            editModal_idealGoal: 0,
        };

        this.openEditModal = this.openEditModal.bind(this);
        this.closeEditModal = this.closeEditModal.bind(this);
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
        this.setState({
            noProjectsFound: this.noProjectsFound(nextProps),
            loadedFromRemote: nextProps.loadedFromRemote,
            projectNames: nextProps.projectNames,
            showEditModal: nextProps.showEditModal,
            editModal_name: nextProps.editModal_name, 
            editModal_minGoal: nextProps.editModal_minGoal,
            editModal_idealGoal: nextProps.editModal_idealGoal,
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
                        <Button bsStyle="danger" onClick={this.deleteProject} className="pull-left">Delete</Button>
                        <Button onClick={this.closeEditModal}>Cancel</Button>
                        <Button bsStyle="primary" onClick={this.editProject}>Save Changes</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}

export default ProjectSection;