import React, {
	Component
} from 'react';
import logo from './logo.svg';
import './App.css';


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

				gapi.auth2.getAuthInstance().signIn().then(
					() => {
						gapi.client.load('sheets', 'v4', () => {
							this._readSheetList(gapi);
						})
					}

				);


			}.bind(this));
		});
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

	// Callback, called when user signIn state changes
	_signInStatusUpdated = (isSignedIn) => {
		this.setState({
			signedIn: isSignedIn
		}); 
	}

	render() {
		var _isSignedIn = this.state ? this.state.signedIn : false;
		var _gapi = this.state ? this.state.gapi : null;

		return ( 
			<NavBar isSignedIn = {_isSignedIn} gapi = {_gapi} />
		);
	}
}

export default App;