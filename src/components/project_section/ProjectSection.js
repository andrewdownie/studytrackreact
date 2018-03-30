import ProjectButtonsWrapper from './ProjectButtonsWrapper';
import ProjectList from './ProjectList';
import {Row, Modal, Button} from 'react-bootstrap';
import React, {Component} from 'react';
import SheetUtil from '../../utils/SheetUtil';
import DateUtil from '../../utils/DateUtil';



class ProjectSection extends Component {
    constructor(props){
        super(props);
        this.state = {
            openStudySessionModalCallback: props.openStudySessionModalCallback,
            openEditProjectModalCallback: props.openEditProjectModalCallback,
            openAddProjectModalCallback: props.openAddProjectModalCallback,
            quickStartStudyCallback: props.quickStartStudyCallback,
            noProjectsFound: this.noProjectsFound(props),
            loadedFromRemote: props.loadedFromRemote,
            showEditProject: false,
        };

        this.openEditModal = this.openEditModal.bind(this);
        this.closeEditModal = this.closeEditModal.bind(this);
    }

    noProjectsFound(props){
        var noProjectsFound;

        if(props.projectNames){
            noProjectsFound = props.projectNames.length == 0 && props.loadedFromRemote;
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
        });
    }

    openEditModal(projectName){
        //TODO: get the info about the selected project...
        //TODO: how?
        var woy = DateUtil.WeekOfYear();
        var projectGoals = this.state.studyData[woy - 1][0][projectName];
        this.setState({
            showEditProject: true,
            editProject_name: projectName,
            editProject_minGoal: projectGoals.minGoal,
            editProject_idealGoal: projectGoals.idealGoal,
        });
    }
    closeEditModal(){
        this.setState({showEditProject: false});
    }


    render(){
        return(
            <div className="show-grid project-section">
                <ProjectButtonsWrapper
                    openStudySessionModalCallback={this.state.openStudySessionModalCallback}
                    openAddProjectModalCallback={this.state.openAddProjectModalCallback}
                    highlightAddProjectButton={this.state.noProjectsFound}
                />
                <ProjectList
                    openEditProjectModalCallback={this.openEditModal}
                    quickStartStudyCallback={this.state.quickStartStudyCallback}
                    loadedFromRemote={this.state.loadedFromRemote}
                    noProjectsFound={this.state.noProjectsFound}
                    projectNames={this.state.projectNames}
                />

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
                        <Button onClick={this.closeEditModal}>Cancel</Button>
                        <Button bsStyle="primary" onClick={this.editProject}>Save Changes</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}

export default ProjectSection;