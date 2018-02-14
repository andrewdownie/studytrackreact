import React, { Component } from 'react';
import {Navbar, Nav, NavItem} from 'react-bootstrap';

class NavBar extends Component {
	constructor(props){
	   super(props); 
		this.state = {};
	}


	signInButtonClick = () => {
		var auth2 = this.props.gapi.auth2.getAuthInstance();

		if(this.props.isSignedIn){
			auth2.signOut();
			console.log("Signed out");
		}
		else{
			//TODO: sign in here
			console.log("Signing in...");
			var gapi = this.props.gapi;
			auth2.signIn().then(
				() => {
					gapi.client.load('sheets', 'v4', () => {
						this._readSheetList(gapi);
					})
				}
			);
		}

	}

	// TODO: should this stuff go into a component?
	_readSheetList(gapi) {
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
				</Nav>
				<Nav pullRight>
					<NavItem onClick={this.signInButtonClick} eventKey={2} href="#">
						{this.signInButtonText()}
					</NavItem>
				</Nav>
			</Navbar>
		);
	}


}

export default NavBar;