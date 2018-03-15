import {Navbar, Nav, NavItem, MenuItem, NavDropdown} from 'react-bootstrap';
import React from 'react';


const Timer = () => {
    return (
        <Navbar fixedBottom>
            <Nav>
                <NavItem eventKey={1} href="#">
                    Link
                </NavItem>
                <NavItem eventKey={2} href="#">
                    Link
                </NavItem>
                <NavDropdown eventKey={3} title="Dropdown" id="basic-nav-dropdown">
                    <MenuItem eventKey={3.1}>Action</MenuItem>
                    <MenuItem eventKey={3.2}>Another action</MenuItem>
                    <MenuItem eventKey={3.3}>Something else here</MenuItem>
                    <MenuItem divider />
                    <MenuItem eventKey={3.4}>Separated link</MenuItem>
                </NavDropdown>
            </Nav>
        </Navbar>
    );
}

export default Timer;