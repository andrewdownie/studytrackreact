import {Modal, Button, OverlayTrigger, DropdownButton, MenuItem} from 'react-bootstrap';
import FaSpinner from 'react-icons/lib/fa/spinner';
import React, {Component} from 'react';


class ProjectModals extends Component{
    constructor(props){
        super(props);


        this.state = { //NOTE: be sure to update componentWillRecieveProps as well
            //show: props.showAddProject
            showAddProject: props.showAddProject,
            showEditProject: props.showEditProject,
            showLoadingModal: props.showLoadingModal,
            addProjectCallback: props.addProjectCallback,
            loadingModalMessage: props.loadingModalMessage,
            editProjectCallback: props.editProjectCallback,
            deleteProjectCallback: props.deleteProjectCallback,
            addProject_name: "",
            addProject_minGoal: 2,
            addProject_idealGoal: 5,
            editProject_name: "",
            editProject_originalName: "",
            editProject_minGoal: 2,
            editProject_idealGoal: 5,
        };

        this.closeEditProject = this.closeEditProject.bind(this);
        this.closeAddProject = this.closeAddProject.bind(this);
        this.deleteProject = this.deleteProject.bind(this);
        this.editProject = this.editProject.bind(this);
        this.addProject = this.addProject.bind(this);

    }

    //TODO: this will be called even when the props havent changed, need to check to see if they've changed or not?
    componentWillReceiveProps(nextProps){
        console.log(nextProps.loadingModalMessage);
        this.setState({
            loadingModalMessage: nextProps.loadingModalMessage,
            showEditProject: nextProps.showEditProject,
            showLoadingModal: nextProps.showLoadingModal,
            showAddProject: nextProps.showAddProject,
            addProjectCallback: nextProps.addProjectCallback,
            editProject_name: nextProps.editProject_name,
            editProject_originalName: nextProps.editProject_name,
            editProject_minGoal: nextProps.editProject_minGoal,
            editProject_idealGoal: nextProps.editProject_idealGoal,
        });
    }
    closeAddProject(){
        this.setState({showAddProject: false});
    }
    closeEditProject() {
        this.setState({showEditProject: false});
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
                        <Button onClick={this.closeAddProject}>Cancel</Button>
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
                        <Button onClick={this.closeEditProject}>Cancel</Button>
                        <Button bsStyle="primary" onClick={this.editProject}>Save Changes</Button>
                    </Modal.Footer>
                </Modal>

                {/* STUDY SESSION MODAL */}
                <Modal show={true}>
                    <Modal.Header closeButton>
                        <Modal.Title>Start a Study Session</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <h4>Project</h4>
                        {/* TODO: how to make a drop down? */}
                        <DropdownButton
                            title={"meow"}
                            key={1}
                            id={`dropdown-basic-${1}`}
                        >
                            <MenuItem eventKey="1">Action</MenuItem>
                            <MenuItem eventKey="2">Another action</MenuItem>
                            <MenuItem eventKey="3" active>
                                Active Item
                            </MenuItem>
                            <MenuItem divider />
                            <MenuItem eventKey="4">Separated link</MenuItem>
                        </DropdownButton>
                        <h4>Duration</h4>
                        <div>
                            <p>Hours</p>
                            <input
                                type="number"
                                className="form-control"
                            />
                        </div>
                        <div>
                            <p>Minutes</p>
                            <input
                                type="number"
                                className="form-control"
                            />
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.closeEditProject}>Cancel</Button>
                        <Button bsStyle="primary" onClick={this.editProject}>Start</Button>
                    </Modal.Footer>
                </Modal>

                {/* LOADING MODAL */}
                <div className="loading-modal-container">
                    <Modal show={this.state.showLoadingModal} className="loading-modal">
                        <Modal.Body>
                            <FaSpinner className="spin"/> {this.state.loadingModalMessage}
                        </Modal.Body>
                    </Modal>
                </div>

            </div>
        );
    }
}

export default ProjectModals;