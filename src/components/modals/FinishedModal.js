import React, {Component} from 'react';
import {Modal, Button} from 'react-bootstrap';

class FinishedModal extends Component{
    constructor(props){
        super(props);

        this.completeTimer = this.completeTimer.bind(this);

        this.state = {
            timeLeft: 120,
            showFinishedModal: false,
        };

        this.runTimer();
    }

    componentWillReceiveProps(nextProps){
        this.setState({
            showFinishedModal: false,
        });
    }


    completeTimer(productivityPercent){
        console.log("THis is complete timer" + productivityPercent);
    }

    runTimer(){
        //console.log(this.state.timerCurrentTime);
        if(this.state.timeLeft > 0){

            setTimeout(function() {
                
                if(this.state.timeLeft > 0){
                    this.runTimer();
                }
                else{
                    this.setState({showFinishedModal: false});
                    this.completeTimer(0.25);
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
            <Modal show={this.state.showFinishedModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Rate your productivity</Modal.Title>
                </Modal.Header>
                <Modal.Footer>
                    <Button className="pull-right" onClick={() => this.completeTimer(1.00)}>100%</Button>
                    <Button className="pull-right" bsStyle="primary" onClick={() => this.completeTimer(0.50)}>50%</Button>
                    <h2 className="pull-left">{this.formatTime(this.state.timeLeft)}</h2>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default FinishedModal;