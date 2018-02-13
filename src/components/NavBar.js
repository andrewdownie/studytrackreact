import React, { Component } from 'react';
import {Navbar, Nav, NavItem} from 'react-bootstrap';

class NavBar extends Component {
    constructor(props){
       super(props); 
        this.state = {msg: "fart oh whoa"};
    }


    signInButtonText(){
        if(this.props.isSignedIn){
            return <span>Sign Out</span>
        }
        return <span>Sign In</span>
    }


    render(){

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
                        {this.signInButtonText()}
                    </NavItem>
                </Nav>
            </Navbar>
        );
    }


}

export default NavBar;