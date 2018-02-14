import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';

import TrackPage from './components/TrackPage';
import NavBar from './components/NavBar';

class App extends Component {

	//SOURCES:
	//  - https://www.reddit.com/r/reactjs/comments/67cqzr/using_the_google_api_in_a_react_app_need_a_bit_of/
	//  - https://github.com/dmison/polydactyl/blob/master/src/components/App.jsx
	componentDidMount() {
		console.log("Component did mount");

		require('google-client-api')().then((gapi) => {
			console.log('initializing GAPI...');
			var CLIENT_ID = '794809467159-f7ngrrspdm6vkma7b6e898d7et7j4p1u.apps.googleusercontent.com';
			var API_KEY = 'AIzaSyDPpbEG8KS9Eu3-yrx9TAlCqaCaCVNCN48';
			var DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'];
			var SCOPES = 'https://www.googleapis.com/auth/drive.file';

			gapi.client.init({
				discoveryDocs: DISCOVERY_DOCS,
				clientId: CLIENT_ID,
				apiKey: API_KEY,
				scope: SCOPES
			}).then(function () {
				console.log('GAPI Initialized.');
				gapi.auth2.getAuthInstance().isSignedIn.listen(this._signInStatusUpdated);

				this.setState({gapi: gapi}, () => {
					// TODO: so we're manually intializing the state, and then manually calling the callback that handles when the sign in state changes... neat
					this._signInStatusUpdated(this.state.gapi.auth2.getAuthInstance().isSignedIn.get());
				});

			}.bind(this));
		});
	}

	_signInStatusUpdated = (isSignedIn) => {
		this.setState({
			signedIn: isSignedIn
		}); 
	}

	render() {
		var _isSignedIn = this.state ? this.state.signedIn : false;
		var _gapi = this.state ? this.state.gapi : null;

		return ( 
			//TODO: what the hell am I supposed to wrap the elements in...? is a div fine?
			<div>
				<NavBar isSignedIn = {_isSignedIn} gapi = {_gapi} />
				<TrackPage />
			</div>
		);
	}
}

export default App;