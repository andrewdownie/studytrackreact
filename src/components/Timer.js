import {Button, Navbar, Nav, NavItem, MenuItem, NavDropdown} from 'react-bootstrap';
import React from 'react';
import FaCog from 'react-icons/lib/fa/cog';
import FaStop from 'react-icons/lib/fa/stop';


const Timer = (props) => {
    return (
        <Navbar fixedBottom className="timer-container">
            <div className="timer-buttons">
                <Button className="timer-stop" bsStyle="danger" onClick={this.editProject}><FaStop/></Button>
                <br/>
                <Button className="timer-settings" bsStyle="default" onClick={this.editProject}><FaCog /></Button>
            </div>
            <div className="timer-labels">
                <div className="timer-project">
                    Project Name go hur
                </div>
                <h1 className="timer-time">
                    00:00
                </h1>
            </div>

        </Navbar>
    );
}

export default Timer;