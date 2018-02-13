import React, { Component } from 'react';
import {Navbar, Nav, NavItem} from 'react-bootstrap';

class NavBar extends Component {
    constructor(props){
       super(props); 

       if(this.props.gapi == null){
            console.log("gapi is null");
       }
       else{
           console.log("not null");
       }

        this.state = {msg: "fart oh whoa"};
    }


    signInButtonClick = () => {
        console.log("Sign in button click what is this being called??");
        if(this.props.isSignedIn){

            console.log(this.props.gapi.auth);
            console.log(this.props.gapi.auth2);

            var auth2 = this.props.gapi.auth2.getAuthInstance();
            if(this.props.gapi.auth != null){
                //TODO: the line below cause exceptions
                //auth.signOut();
                console.log("Signing out...");
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

       if(this.props.gapi == null){
            console.log("gapi is null");
       }
       else{
           console.log("not null");
       }

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