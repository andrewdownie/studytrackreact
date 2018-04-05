import React, {Component} from 'react';
import {Modal, Button} from 'react-bootstrap';

class StopSessionModal extends Component{
    constructor(props){
        super(props);

        this.state = {
            callbacks: props.callbacks,
            showStopSessionModal: false,
        };
    }

    componentWillReceiveProps(nextProps){
        this.setState({
            showStopSessionModal: nextProps.showStopSessionModal,
        });
    }

    render(){
        return(
            /* STUDY SESSION WARNING MODAL */
            <Modal show={this.state.showStopSessionModal}>
                <Modal.Header closeButton>
                    <Modal.Title>WARNING! Timer not done yet</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        If you cancel the timer now, only 50% of the timer you've studied will be recorded.
                        If you want 100% of your study time this session to be recored, then continue Studying
                        until the timer ends, and  considering setting a shorter timer next time.
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button bsStyle="danger" onClick={this.state.callbacks.cancelStudySession}>Cancel Session</Button>
                    <Button bsStyle="default" onClick={this.state.callbacks.hideStopSessionModal}>Continue Session</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default StopSessionModal;