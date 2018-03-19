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
            timerStartTime: props.timerStartTime,
            timerCurrentTime: props.timerTime,
            stopTimerClick: props.stopTimerClick,
        }


        this.timerStop = this.timerStop.bind(this);
        this.formatTimer = this.formatTimer.bind(this);

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
            timerStartTime: nextProps.timerStartTime,
        }, () => {

            if(startTimerNow){
                this.setState(
                    {timerCurrentTime: this.state.timerStartTime},
                    ()=>{this.runTimer()}
                );
            }
        });
    }


    timerStop(){
        //TODO: will I need a piece of state to describe the fact that a timer has ended and user interaction (may or may not) be required?
        var timerDirection = this.state.timerDirection;
        var timerTime = this.state.timerStartTime;
        var timerTitle = this.state.timerTitle;

        var timerStopInfo = {
            timerDirection,
            timerTitle,
            timerTime,
        }

        this.state.stopTimerClick(timerStopInfo);
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
                this.setState({timerCurrentTime: this.state.timerCurrentTime + dir});
            }.bind(this),
            1000);
        }
    }

    formatTimer(seconds){
        //TODO: this could be made cleaner
        var remaining = seconds;
        var outputHours, outputMinutes, outputSeconds;
        var hours, minutes, seconnds;
        hours = Math.floor(seconds / 3600);
        remaining = remaining - (hours * 3600);
        minutes = Math.floor(seconds / 60);
        remaining = remaining - (minutes * 60);
        seconds = remaining;

        outputHours = hours;
        outputMinutes = minutes;
        outputSeconds = seconds;

        if(hours < 10){
            outputHours = "0" + hours;
        }
        if(minutes < 10){
            outputMinutes = "0" + minutes;
        }
        if(seconds < 10){
            outputSeconds = "0" + seconds;
        }

        return outputHours + ":" + outputMinutes + ":" + outputSeconds;
    }

    render(){
        if(!this.state.timerRunning){
            return <div></div>;
        }
        return (
            <Navbar fixedBottom className="timer-container">
                <div className="timer-buttons">
                    <Button className="timer-stop" bsStyle="danger" onClick={this.state.stopTimerClick}><FaStop/></Button>
                    <br/>
                    <Button className="timer-settings" bsStyle="default" onClick={this.timerSettings}><FaCog /></Button>
                </div>
                <div className="timer-labels">
                    <div className="timer-project">
                        {this.state.timerTitle}
                    </div>
                    <h1 className="timer-time">
                        {this.formatTimer(this.state.timerCurrentTime)}
                    </h1>
                </div>

            </Navbar>
        );
    }
}

export default Timer;