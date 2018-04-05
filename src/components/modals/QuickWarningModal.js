
import React, {Component} from 'react';
import {Modal, Button} from 'react-bootstrap';

class QuickWarningModal extends Component{
    constructor(props){
        super(props);

        this.state = {
            callbacks: props.callbacks,
            showQuickWarningModal: false,
        };
    }

    componentWillReceiveProps(nextProps){
        this.setState({
            showQuickWarningModal: nextProps.showQuickWarningModal,
        });
    }

    render(){
        return(
            /* 10 MINUTE WARNING MODAL */
            <Modal show={this.state.showQuickWarningModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Warning!</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>
                        You have studied for less than 10 minutes this quick study session.
                        If you cancel now only half of your study time will be recorded.
                        If you would like to have 100% of your study time recorded, study for 
                        at least 10 minutes.
                    </p>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.state.callbacks.hideQuickWarningModal}>Keep Studying</Button>
                    <Button onClick={this.state.callbacks.cancelStudySession} bsStyle="danger">Cancel Anyway</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default QuickWarningModal;