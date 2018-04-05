
import React, {Component} from 'react';
import {Modal, Button} from 'react-bootstrap';
import FaSpinner from 'react-icons/lib/fa/spinner';

class LoadingModal extends Component{
    constructor(props){
        super(props);

        this.state = {
            showLoadingModal: false,
            loadingModalMessage: '',
        };
    }

    componentWillReceiveProps(nextProps){
        this.setState({
            showLoadingModal: nextProps.showLoadingModal,
            loadingModalMessage: nextProps.loadingModalMessage,
        });
    }

    render(){
        return(
            /* LOADING MODAL */
            <div className="loading-modal-container">
                <Modal show={this.state.showLoadingModal} className="loading-modal">
                    <Modal.Body>
                        <h2><FaSpinner className="spin"/> {this.state.loadingModalMessage}</h2>
                    </Modal.Body>
                </Modal>
            </div>
        );
    }
}

export default LoadingModal;