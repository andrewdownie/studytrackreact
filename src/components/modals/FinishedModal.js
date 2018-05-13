import React, {Component} from 'react';
import {Modal, Button} from 'react-bootstrap';

const TIME_LEFT_DEFAULT = 30;

class FinishedModal extends Component{

    constructor(props){
        super(props);

        this.state = {
            completeTimer: props.completeTimer,
            finishedModalVisible: false,
            timeLeft: 0,
            isSignedIn: props.isSignedIn,
        };

    }



    componentWillReceiveProps(nextProps){


        if(nextProps.finishedModalVisible === true
            && this.state.finishedModalVisible === false){
            this.setState({
                finishedModalVisible: nextProps.finishedModalVisible,
                timeLeft: TIME_LEFT_DEFAULT,
                isSignedIn: nextProps.isSignedIn,
            }, () => {
                this.runTimer();
            });
        }
        else{
            this.setState({
                finishedModalVisible: nextProps.finishedModalVisible,
                isSignedIn: nextProps.isSignedIn,
            });
        }

    }



    runTimer(){
        //console.log(this.state.timerCurrentTime);
        console.log(this.state.isSignedIn);
        if(this.state.timeLeft > 1 && this.state.isSignedIn){

            setTimeout(function() {
                
                if(this.state.timeLeft > 1){
                    this.runTimer();
                }
                else if(this.state.finishedModalVisible){
                    this.setState({showFinishedModal: false, timeLeft: 0});
                    this.state.completeTimer(0.25);
                }
                this.setState({timeLeft: this.state.timeLeft - 1});
            }.bind(this),
            1000);
        }

        if(this.state.isSignedIn === false){
            this.setState({timeLeft: 0});
        }
    }

    formatTime(seconds){
        var minutes = Math.floor(seconds / 60);
        seconds = seconds - minutes * 60;

        if(minutes < 10){
            minutes = "0" + minutes;
        }

        if(seconds < 10){
            seconds = "0" + seconds;
        }


        return minutes + ":" + seconds;

    }



    render(){
        return(
            /* FINSIHED MODAL */
            <Modal show={this.state.finishedModalVisible}>
                <Modal.Header closeButton>
                    <Modal.Title>Rate your productivity</Modal.Title>
                </Modal.Header>
                <Modal.Footer>
                    <Button className="pull-right" onClick={() => this.state.completeTimer(1.00)}>100%</Button>
                    <Button className="pull-right" bsStyle="primary" onClick={() => this.state.completeTimer(0.50)}>50%</Button>
                    <h2 className="pull-left">{this.formatTime(this.state.timeLeft)}</h2>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default FinishedModal;