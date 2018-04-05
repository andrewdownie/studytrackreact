import React, {Component} from 'react';
import {Modal, Button} from 'react-bootstrap';

class EditModal extends Component {
    constructor(props){
        super(props);


        /* Bindings */
        this.deleteProjectPassthru = this.deleteProjectPassthru.bind(this);
        this.editProjectPassthru = this.editProjectPassthru.bind(this);

        /* Initial States */
        this.state={
            name: '',
            originalName: '',
            minGoal: 2,
            idealGoal: 5,
            showModal: false,
            callbacks: props.callbacks,
        };
    }

    componentWillReceiveProps(nextProps){
        this.setState({
            name: nextProps.editModal_name,
            originalName: nextProps.editModal_name,
            minGoal: nextProps.editModal_minGoal,
            idealGoal: nextProps.editModal_idealGoal,
            showModal: nextProps.showEditModal,
        });
    }



    deleteProjectPassthru() {
        this.state.callbacks.deleteProject(this.state.originalName);
    }
    editProjectPassthru() {
        var newProjectInfo = {};
        newProjectInfo.newName = this.state.name;
        newProjectInfo.originalName = this.state.originalName;
        newProjectInfo.minGoal = this.state.minGoal;
        newProjectInfo.idealGoal = this.state.idealGoal;
        console.log("new name: " + newProjectInfo.newName + ", original name: " + newProjectInfo.originalName);
        this.state.callbacks.editProject(newProjectInfo);
    }

    render(){
        return (
            /* EDIT PROJECT MODAL */
            <Modal show={this.state.showModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit project</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h5>Title</h5>
                    <input
                        type="text"
                        className="form-control"
                        value={this.state.name}
                        onChange={(event) => {this.setState({name: event.target.value})}}
                    />
                    <h5>Minimum Weekly Goal (hours)</h5>
                    <input
                        type="number"
                        className="form-control"
                        value={this.state.minGoal}
                        onChange={(event) => {this.setState({minGoal: event.target.value})}}
                    />
                    <h5>Ideal Weekly Goal (hours)</h5>
                    <input
                        type="number"
                        className="form-control"
                        value={this.state.idealGoal}
                        onChange={(event) => {this.setState({idealGoal: event.target.value})}}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button bsStyle="danger" onClick={this.deleteProjectPassthru} className="pull-left">Delete</Button>
                    <Button onClick={this.state.callbacks.closeEditModal}>Cancel</Button>
                    <Button bsStyle="primary" onClick={this.editProjectPassthru}>Save Changes</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default EditModal;