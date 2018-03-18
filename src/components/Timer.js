import {Button, Navbar, Nav, NavItem, MenuItem, NavDropdown} from 'react-bootstrap';
import React, {Component} from 'react';
import FaCog from 'react-icons/lib/fa/cog';
import FaStop from 'react-icons/lib/fa/stop';


class Timer extends Component{
    constructor(props){
        super(props);

        this.state={
            timerDirection: props.timerDirection,
            timerRunning: props.timerRunning,
            timerTitle: props.timerTitle,
            timerTime: props.timerTime,
            stopTimerCallback: props.stopTimerCallback,
        }


        this.timerStop = this.timerStop.bind(this);

    }


    componentWillReceiveProps(nextProps){
        //Start the timer this update
        var startTimerNow = false;
        if(this.state.timerRunning === false){
            if(nextProps.timerRunning === true){
                startTimerNow = true;
            }
        }

        this.setState({
            timerDirection: nextProps.timerDirection,
            timerRunning: nextProps.timerRunning,
            timerTitle: nextProps.timerTitle,
            timerTime: nextProps.timerTime,
        }, () => {

            if(startTimerNow){
                this.runTimer();
            }
        });
    }


    timerStop(){
        //TODO: will I need a piece of state to describe the fact that a timer has ended and user interaction (may or may not) be required?
        var timerDirection = this.state.timerDirection;
        var timerTime = this.state.timerTime;
        var timerTitle = this.state.timerTitle;

        var timerStopInfo = {
            timerDirection,
            timerTitle,
            timerTime,
        }

        this.state.stopTimerCallback(timerStopInfo);
    }
    timerSettings(){
        console.log("this is timer settings");
        //TODO: show a modal here...
    }

    runTimer(){
        //TODO: this wont get set right away. The first thing this will see is false, and then it wont even run once
        if(this.state.timerRunning){
            var dir = 1;
            if(this.state.timerDirection === 'down'){
                dir = -1;
            }

            setTimeout(function() {
                this.runTimer();
                this.setState({timerTime: this.state.timerTime + dir});
            }.bind(this),
            1000);
        }
    }

    render(){
        if(!this.state.timerRunning){
            return <div></div>;
        }
        return (
            <Navbar fixedBottom className="timer-container">
                <div className="timer-buttons">
                    <Button className="timer-stop" bsStyle="danger" onClick={this.timerStop}><FaStop/></Button>
                    <br/>
                    <Button className="timer-settings" bsStyle="default" onClick={this.timerSettings}><FaCog /></Button>
                </div>
                <div className="timer-labels">
                    <div className="timer-project">
                        {this.state.timerTitle}
                    </div>
                    <h1 className="timer-time">
                        {this.state.timerTime}
                    </h1>
                </div>

            </Navbar>
        );
    }
}

export default Timer;