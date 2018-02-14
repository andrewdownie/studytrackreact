import React, { Component } from 'react';
import {Navbar, Nav, NavItem} from 'react-bootstrap';

class NavBar extends Component {
    constructor(props){
       super(props); 
        this.state = {};
    }


    signInButtonClick = () => {
        if(this.props.isSignedIn){
            if(this.props.gapi.auth2 != null){
                var auth2 = this.props.gapi.auth2.getAuthInstance();
                auth2.signOut();
            }
        }
    }


    signInButtonText = () => {
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
                    <NavItem onClick={this.signInButtonClick} eventKey={2} href="#">
                        {this.signInButtonText()}
                    </NavItem>
                </Nav>
            </Navbar>
        );
    }


}

export default NavBar;