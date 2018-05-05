
import {Modal, Button} from 'react-bootstrap';
import React, {Component} from 'react';

class SettingsModal extends Component{
    constructor(props){
        super(props);

        /* Bindings */
        this.hideSettingsModalPassthru = this.hideSettingsModalPassthru.bind(this);
        this.onChangeTimerVolume = this.onChangeTimerVolume.bind(this);
        this.onChangeAlarmVolume = this.onChangeAlarmVolume.bind(this);

        this.state = {
            settingsModalVisible: props.settingsModalVisible,
            hideSettingsModal: props.hideSettingsModal,
            timerVolume: props.timerVolume,
            alarmVolume: props.alarmVolume,
            timerRunning: props.timerRunning,
        };
    }

    componentWillReceiveProps(nextProps){

        if(this.state.settingsModalVisible === false || nextProps.timerRunning === false){
            this.setState({
                settingsModalVisible: nextProps.settingsModalVisible,
                timerVolume: nextProps.timerVolume,
                alarmVolume: nextProps.alarmVolume,
                timerRunning: nextProps.timerRunning,
            });
        }
        else{
            this.setState({
                settingsModalVisible: nextProps.settingsModalVisible,
                timerRunning: nextProps.timerRunning,
            });
        }

    }

    onChangeTimerVolume(event){
        this.setState({timerVolume: event.target.value});
    }

    onChangeAlarmVolume(event){
        this.setState({alarmVolume: event.target.value});
    }

    hideSettingsModalPassthru(){
        localStorage.timerVolume = this.state.timerVolume;
        localStorage.alarmVolume = this.state.alarmVolume;

        this.state.hideSettingsModal(this.state.timerVolume, this.state.alarmVolume);
    }


    render(){
        return(
            /* SETTINGS MODAL */
            <Modal show={this.state.settingsModalVisible}>
                <Modal.Header closeButton>
                    <Modal.Title>Timer Settings</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h3>Ticking Volume</h3>
                    <input onChange={this.onChangeTimerVolume} id="" type="range" min="0" max="1" value={this.state.timerVolume} step="0.005" />
                    <h3>Alarm Volume</h3>
                    <input onChange={this.onChangeAlarmVolume} id="" type="range" min="0" max="1" value={this.state.alarmVolume} step="0.005" />
                </Modal.Body>
                <Modal.Footer>
                    <Button bsStyle="primary" onClick={this.hideSettingsModalPassthru}>Close Settings</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default SettingsModal;