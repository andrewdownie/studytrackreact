import {Navbar, Nav, NavItem} from 'react-bootstrap';
import FaSpinner from 'react-icons/lib/fa/spinner';
import FaSignIn from 'react-icons/lib/fa/sign-in';
import FaSignOut from 'react-icons/lib/fa/sign-out';
import React from 'react';


const NavBar = (props) => {

	const signInButtonClick = () => {
		var auth2 = props.gapi.auth2.getAuthInstance();

		if(props.isSignedIn){
            localStorage.clear();
			auth2.signOut();
			console.log("Signed out, clearing all localStorage");
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
			return <span><FaSignOut /> Sign Out</span>
        }
        else if(props.gapi == null){
            return <div className="text-center sign-in-loading"><FaSpinner className="spin"/> Loading</div>;
        }
		return <span><FaSignIn /> Sign In</span>
	}

	return (
		<Navbar className="top-nav">
			<Navbar.Header>
				<Navbar.Brand>
					<a href="#home">StudyTrack (React)</a>
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