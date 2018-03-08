import {Modal, Button, OverlayTrigger} from 'react-bootstrap';
import React, {Component} from 'react';


class ProjectModals extends Component{
    constructor(props){
        super(props);

        console.log(props.showAddProject);

        this.state = {
            //show: props.showAddProject
            showAddProject: props.showAddProject,
            showEditProject: props.showEditProject,
            addProjectCallback: props.addProjectCallback,
            addProject_name: "",
            addProject_minGoal: 2,
            addProject_idealGoal: 5,
        };

        this.closeAddProject = this.closeAddProject.bind(this);
        this.addProject = this.addProject.bind(this);

    }

    //TODO: this will be called even when the props havent changed, need to check to see if they've changed or not?
    componentWillReceiveProps(nextProps){
        this.setState({showAddProject: nextProps.showAddProject, addProjectCallback: nextProps.addProjectCallback});
    }
    closeAddProject(){
        this.setState({showAddProject: false});
    }


    addProject(){
        console.log("This is add project");
        console.log(this.state.addProject_name);

        this.state.addProjectCallback({
            title: this.state.addProject_name,
            minGoal: this.state.addProject_minGoal,
            idealGoal: this.state.addProject_idealGoal,
        });
    }

    render(){
        return(
            <div>
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

                <Modal show={this.state.showEditProject}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit project</Modal.Title>
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
            </div>
        );
    }
}

export default ProjectModals;