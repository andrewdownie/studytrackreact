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
            saveTimerDuration: props.saveTimerDuration,
            showQuickWarning: props.showQuickWarning,
            showStudyWarning: props.showStudyWarning,
        }


        this.stopButtonClick = this.stopButtonClick.bind(this);
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
            timerStartTime: nextProps.timerStartTime,
            timerRunning: nextProps.timerRunning,
            timerTitle: nextProps.timerTitle,
        }, () => {

            if(startTimerNow){
                this.setState(
                    {timerCurrentTime: this.state.timerStartTime},
                    ()=>{this.runTimer()}
                );
            }
        });
    }


    stopButtonClick(){
        var timerDirection = this.state.timerDirection;
        var timerTitle = this.state.timerTitle;
        var timerTime = this.state.timerCurrentTime;

        var timerStopInfo = {
            timerDirection: this.state.timerDirection,
            timerTitle: this.state.timerTitle,
        }



        if(timerDirection == 'up'){
            timerStopInfo.timerTime = this.state.timerCurrentTime;
            if(timerTime < 60 * 10){
                this.state.showQuickWarning();
            }
            else{
                this.state.saveTimerDuration(timerStopInfo);
            }
        }
        else if(timerDirection == 'down'){
            timerStopInfo.timerTime = this.state.timerStartTime;
            console.log("MOOOOOOOOOOOEEEEEEEEEEEEEEEEEEEEEEEEEWWWWWWWWWWWWW");
            if(timerTime > 0){
                console.log("show the fractional modal");
                this.state.showStudyWarning();
            }
            //TODO: if (timerTime > 0){ show fractional modal; }
            //TODO: will there need to be an active check to see when a study session ends?
            //TODO: what happens when teh user presses the stop button in a full weight study session?
            //TODO: fractional amount of time right?
            //TODO: need to show warning
        }
    }


    timerSettings(){
        console.log("this is timer settings");
        //TODO: show a modal here...
    }

    runTimer(){
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

        if(hours == 0){
            outputHours = "";
        }
        else if(hours < 10){
            outputHours = "0" + hours + ":"
        }
        if(minutes < 10){
            outputMinutes = "0" + minutes;
        }
        if(seconds < 10){
            outputSeconds = "0" + seconds;
        }

        return outputHours + outputMinutes + ":" + outputSeconds;
    }

    render(){
        if(!this.state.timerRunning){
            return <div></div>;
        }
        return (
            <Navbar fixedBottom className="timer-container">
                <div className="timer-buttons">
                    <Button className="timer-stop" bsStyle="danger" onClick={this.stopButtonClick}><FaStop/></Button>
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