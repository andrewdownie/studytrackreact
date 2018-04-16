import React, {Component} from 'react';
import {Modal, Button} from 'react-bootstrap';

class EditModal extends Component {
    constructor(props){
        super(props);


        /* Bindings */
        this.deleteProjectPassthru = this.deleteProjectPassthru.bind(this);
        this.editProjectPassthru = this.editProjectPassthru.bind(this);
        this.onChangeName = this.onChangeName.bind(this);
        this.onChangeMinGoal = this.onChangeMinGoal.bind(this);
        this.onChangeIdealGoal = this.onChangeIdealGoal.bind(this);

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

    onChangeName(event){
        console.log("change name pls");
        var valid = /[a-zA-Z0-9_-]*/
        var match = valid.exec(event.target.value);
        this.setState({name: match});
    }
    onChangeMinGoal(event){
        console.log("change min pls");
        var numsOnly = /[0-9]*/
        var match = numsOnly.exec(event.target.value);
        this.setState({minGoal: match});
    }
    onChangeIdealGoal(event){
        console.log("change ideal pls");
        var numsOnly = /[0-9]*/
        var match = numsOnly.exec(event.target.value);
        this.setState({idealGoal: match});
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
                        onChange={this.onChangeName}
                    />
                    <h5>Minimum Weekly Goal (hours)</h5>
                    <input
                        type="number"
                        className="form-control"
                        value={this.state.minGoal}
                        onChange={this.onChangeMinGoal}
                    />
                    <h5>Ideal Weekly Goal (hours)</h5>
                    <input
                        type="number"
                        className="form-control"
                        value={this.state.idealGoal}
                        onChange={this.onChangeIdealGoal}
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