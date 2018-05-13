
import React, {Component} from 'react';
import {Modal, Button} from 'react-bootstrap';

class AddModal extends Component{
    constructor(props){
        super(props);

        /* Bindings */
        this.addProjectPassthru = this.addProjectPassthru.bind(this);
        this.onChangeName = this.onChangeName.bind(this);
        this.onChangeMinGoal = this.onChangeMinGoal.bind(this);
        this.onChangeIdealGoal = this.onChangeIdealGoal.bind(this);

        /* Initial State */
        this.state = {
            callbacks: props.callbacks,
            showAddModal: props.showAddModal,
            name: "",
            minGoal: props.addModal_minGoal,
            idealGoal: props.addModal_idealGoal,
        };
    }

    componentWillReceiveProps(nextProps){

        this.setState({
            showAddModal: nextProps.showAddModal,
            name: nextProps.addModal_name,
            minGoal: nextProps.addModal_minGoal,
            idealGoal: nextProps.addModal_idealGoal,
        });
    }


    addProjectPassthru(){
        if(this.state.name.length > 0){
            this.state.callbacks.addProject({
                title: this.state.name,
                minGoal: this.state.minGoal,
                idealGoal: this.state.idealGoal,
            });
        }
    }

    onChangeName(event){
        var valid = /[ a-zA-Z0-9_-]*/
        var match = valid.exec(event.target.value);
        this.setState({name: match});
    }
    onChangeMinGoal(event){
        var numsOnly = /[0-9]*/
        var match = numsOnly.exec(event.target.value);
        this.setState({minGoal: match});
    }
    onChangeIdealGoal(event){
        var numsOnly = /[0-9]*/
        var match = numsOnly.exec(event.target.value);
        this.setState({idealGoal: match});
    }

    render(){
        return(
            /* ADD PROJECT MODAL */
            <Modal show={this.state.showAddModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Add a project</Modal.Title>
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
                    <Button onClick={this.state.callbacks.closeAddModal}>Cancel</Button>
                    <Button bsStyle="primary" onClick={this.addProjectPassthru}>Add Project</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default AddModal;