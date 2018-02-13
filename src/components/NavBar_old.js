import React, { Component } from 'react';
import {Navbar, Nav, NavItem} from 'react-bootstrap';

class NavBar extends Component {
    constructor(props){
       super(props); 
        this.state = {msg: "fart oh whoa"};
    }


    render(){
        console.log("gapi: " + this.props.gapi == null);

        return (
            <Navbar>
                <Navbar.Header>
                    <Navbar.Brand>
                        <a href="#home">React-Bootstrap</a>
                    </Navbar.Brand>
                </Navbar.Header>
                <Nav>
                    <NavItem eventKey={1} href="#">
                        Link
                    </NavItem>
                    <NavItem eventKey={2} href="#">
                        Link {this.state.msg}
                    </NavItem>
                </Nav>
            </Navbar>
        );
    }


}

export default NavBar;