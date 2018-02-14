import {Navbar, Nav, NavItem} from 'react-bootstrap';
import React, { Component } from 'react';


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
			var gapi = props.gapi;
			auth2.signIn().then(
				() => {
					gapi.client.load('sheets', 'v4', () => {
						_readSheetList(gapi);
					})
				}
			);
		}
	}

	// TODO: should this stuff go into a component?
	// TODO: ya it should go into the body right? It shouldn't be chained, it should just check the prop to see if things are signed in,
	//			if they are signed in then it should perform the request to load contents into the body, the navbar shouldn't care about the actual data from the sheet
	const _readSheetList = (gapi) => {
		gapi.client.sheets.spreadsheets.values.get({
			spreadsheetId: '1u9ljq0razYyn-yTou6e8yAoHuLnCdGKU_a7URpbeSvg',
			range: 'A1:E1',
		}).then(function (response) {
			console.log("RESULT OF CALL:");
			console.log(response);
			console.log(response.result);

			var range = response.result;
			if (range.values.length > 0) {
				console.log('Name, Major');
				for (var i = 0; i < range.values.length; i++) {
					var row = range.values[i];
					// Print columns A and E, which correspond to indices 0 and 4.
					console.log(row[0] + ', ' + row[4]);
				}
			} else {
				console.log("no data found");
			}
		}, function (response) {
			console.log('Error: ' + response.result.error.message);
		});
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
				<NavItem eventKey={1} href="#">
					Link
				</NavItem>
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