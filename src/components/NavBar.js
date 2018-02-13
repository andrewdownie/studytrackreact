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


    signInButtonClick(){
        console.log("Sign in button click");
        if(this.props.isSignedIn){
            //TODO: how make signing out work?
            //TODO: cannot read clear property of null (where tf do I try to read clear, and why is this even running before I click the button???)
            this.props.gapi.auth.signOut();
        }
    }


    signInButtonText(){
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
                    <NavItem onClick={this.signInButtonClick()} eventKey={2} href="#">
                        {this.signInButtonText()}
                    </NavItem>
                </Nav>
            </Navbar>
        );
    }


}

export default NavBar;