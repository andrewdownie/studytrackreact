import {Navbar, Nav, NavItem} from 'react-bootstrap';
import React from 'react';


const NavBar = (props) => {

	const signInButtonClick = () => {
		var auth2 = props.gapi.auth2.getAuthInstance();

		if(props.isSignedIn){
			auth2.signOut();
			console.log("Signed out");
		}
		else{
			//TODO: sign in here
			console.log("Signing in...");
			auth2.signIn().then(
				//DO NOTHING...
			);
		}
	}


	const signInButtonText = () => {
		if(props.isSignedIn){
			return <span>Sign Out</span>
		}
		return <span>Sign In</span>
	}

	return (
		<Navbar>
			<Navbar.Header>
				<Navbar.Brand>
					<a href="#home">React-Bootstrap</a>
				</Navbar.Brand>
			</Navbar.Header>
			<Nav>
                {/*
                <NavItem eventKey={1} href="#">
					Track
				</NavItem>
				<NavItem eventKey={1} href="#">
					Setup Projects
				</NavItem>
                */}
			</Nav>
			<Nav pullRight>
				<NavItem onClick={signInButtonClick} eventKey={2} href="#">
					{signInButtonText()}
				</NavItem>
			</Nav>
		</Navbar>
	);

}

export default NavBar;