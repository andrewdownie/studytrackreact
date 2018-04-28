
import {Modal, Button} from 'react-bootstrap';
import React, {Component} from 'react';

class SettingsModal extends Component{
    constructor(props){
        super(props);

        /* Bindings */
        this.hideSettingsModalPassthru = this.hideSettingsModalPassthru.bind(this);
        this.onChangeTimerVolume = this.onChangeTimerVolume.bind(this);

        this.state = {
            settingsModalVisible: props.settingsModalVisible,
            hideSettingsModal: props.hideSettingsModal,
            timerVolume: props.timerVolume,
        };
    }

    componentWillReceiveProps(nextProps){

        if(this.state.settingsModalVisible === false){
            this.setState({
                settingsModalVisible: nextProps.settingsModalVisible,
                timerVolume: nextProps.timerVolume,
            });
        }
        else{
            this.setState({
                settingsModalVisible: nextProps.settingsModalVisible,
            });
        }

    }

    onChangeTimerVolume(event){
        this.setState({timerVolume: event.target.value});
    }

    hideSettingsModalPassthru(){
        //TODO: make the other end use the timer volume value passed
        this.state.hideSettingsModal(this.state.timerVolume);
    }


    render(){
        return(
            /* SETTINGS MODAL */
            <Modal show={this.state.settingsModalVisible}>
                <Modal.Header closeButton>
                    <Modal.Title>Timer Settings</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h2>Ticking Volume</h2>
                    <input onChange={this.onChangeTimerVolume} id="" type="range" min="0" max="1" value={this.state.timerVolume} step="0.005" />
                </Modal.Body>
                <Modal.Footer>
                    <Button bsStyle="primary" onClick={this.hideSettingsModalPassthru}>Close Settings</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default SettingsModal;