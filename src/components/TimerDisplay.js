import React from 'react';
import {Button, Navbar} from 'react-bootstrap';
import FaStop from 'react-icons/lib/fa/stop';
import FaCog from 'react-icons/lib/fa/cog';

const formatTimer = (startTime, endTime, direction) => {

    var seconds = 0;
    var currentTime = new Date().getTime();

    //TODO: need to use current time for both...
    if(direction === 'down') {
        //seconds = (endTime - startTime) / 1000;
        var timePassed = currentTime - startTime;
        var totalTime = endTime - startTime;
        seconds = (totalTime - timePassed) / 1000;
    }
    else {
        seconds = (currentTime - startTime) / 1000;
    }

    //TODO: this could be made cleaner
    var remaining = seconds;
    var outputHours, outputMinutes, outputSeconds;
    var hours, minutes;

    hours = Math.floor(seconds / 3600);
    remaining = remaining - (hours * 3600);
    minutes = Math.floor(remaining/ 60);
    remaining = remaining - (minutes * 60);


    outputHours = hours;
    outputMinutes = minutes;
    outputSeconds = Math.floor(remaining);

    if(hours === 0){
        outputHours = "";
    }
    else if(hours < 10){
        outputHours = "0" + hours + ":";
    }
    else{
        outputHours = hours + ":";
    }

    if(minutes < 10){
        outputMinutes = "0" + minutes;
    }

    if(outputSeconds < 10){
        outputSeconds = "0" + outputSeconds;
    }

    return outputHours + outputMinutes + ":" + outputSeconds;
}

const Timer = (props) => {
    return (
        <Navbar fixedBottom className="timer-container">
            <div className="timer-buttons">
                <Button className="timer-stop" bsStyle="danger" onClick={props.callbacks.stopButtonClick}><FaStop/></Button>
                <Button className="timer-settings" bsStyle="default" onClick={props.callbacks.settingsButtonClick}><FaCog /></Button>
            </div>
            <div className="timer-labels">
                <div className="timer-project">
                    {props.timerTitle}
                </div>
                <h1 className="timer-time">
                    {formatTimer(props.timerStart, props.timerEnd, props.timerDirection)}
                </h1>
            </div>
        </Navbar>
    );
}

export default Timer;