import React from 'react';
import {Button, Navbar} from 'react-bootstrap';
import FaStop from 'react-icons/lib/fa/stop';
import FaCog from 'react-icons/lib/fa/cog';

const formatTimer = (startTime, endTime, direction) => {
    console.log("Why is everything zero?");
    //TODO: figure out why the values coming into to 
    //TODO: here become zero?
    console.log(startTime);
    console.log(endTime);
    console.log(direction);

    var seconds = 0;

    if(direction === 'down'){
        seconds = (endTime - startTime) / 1000;
    }
    else{
        seconds = (new Date().getTime() - startTime) / 1000;
    }

    console.log(seconds);

    //TODO: this could be made cleaner
    var remaining = seconds;
    var outputHours, outputMinutes, outputSeconds;
    var hours, minutes;
    hours = Math.floor(seconds / 3600);
    remaining = remaining - (hours * 3600);
    minutes = Math.floor(seconds / 60);
    remaining = remaining - (minutes * 60);
    seconds = remaining;

    outputHours = hours;
    outputMinutes = minutes;
    outputSeconds = seconds;

    if(hours === 0){
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