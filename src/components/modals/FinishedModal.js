import React, {Component} from 'react';
import {Modal, Button} from 'react-bootstrap';

const TIME_LEFT_DEFAULT = 10;

class FinishedModal extends Component{

    constructor(props){
        super(props);

        this.state = {
            completeTimer: props.completeTimer,
            finishedModalVisible: false,
            timeLeft: TIME_LEFT_DEFAULT,//TODO: set this to 120
        };

    }

    componentWillReceiveProps(nextProps){
        var timeLeft = this.state.timeLeft;

        if(this.state.finishedModalVisible === false){
            timeLeft = TIME_LEFT_DEFAULT;
        }

        if(nextProps.finishedModalVisible === true){
            if(this.state.finishedModalVisible === false){
                this.runTimer();
            }
        }

        this.setState({
            finishedModalVisible: nextProps.finishedModalVisible,
            timeLeft: timeLeft,
        });
    }



    runTimer(){
        //console.log(this.state.timerCurrentTime);
        if(this.state.timeLeft > 1){

            setTimeout(function() {
                
                if(this.state.timeLeft > 1){
                    this.runTimer();
                }
                else{
                    this.setState({showFinishedModal: false});
                    this.state.completeTimer(0.25);
                }
                this.setState({timeLeft: this.state.timeLeft - 1});
            }.bind(this),
            1000);
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