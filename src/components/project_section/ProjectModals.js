import React, {Component} from 'react';
import {Modal, Button, OverlayTrigger} from 'react-bootstrap';


class ProjectModals extends Component{
    constructor(props){
        super(props);

        this.closeAddProject = this.closeAddProject.bind(this);

        this.state = {
            //show: props.showAddProject
            show: true,
            addProject: props.addProject
        };
    }

    closeAddProject(){
        console.log("pls?");
        this.setState({show: false});
    }

    render(){
        return(
            <Modal show={this.state.show}>
            <Modal.Header closeButton>
              <Modal.Title>Add a project</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <h4>Text in a modal</h4>
              <p>
                Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
              </p>
  
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={this.closeAddProject}>Cancel</Button>
              <Button bsStyle="primary" onClick={this.state.addProject}>Add</Button>
            </Modal.Footer>
          </Modal>
        );
    }
}

export default ProjectModals;