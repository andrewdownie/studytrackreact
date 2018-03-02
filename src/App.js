import React, { Component } from 'react';

//import logo from './logo.svg';
import './App.css';

import TrackPage from './components/TrackPage';
import NavBar from './components/NavBar';
import InfoPage from './components/InfoPage';

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

                //TODO: why would do a async chain when I could do everything in one set state (set gapi, set signedIn)
                this.setState({gapi: gapi, signedIn: gapi.auth2.getAuthInstance().isSignedIn.get()});

			}.bind(this));
		});
	}

	_signInStatusUpdated = (isSignedIn) => {
        // This is a callback for the nav to call when the user clicks sign out
		this.setState({signedIn: isSignedIn}); 
	}


	render() {
		var _isSignedIn = this.state ? this.state.signedIn : false;
        var _gapi = this.state ? this.state.gapi : null;
        var pageBody;
        
        if(_isSignedIn){
            pageBody = <TrackPage isSignedIn={_isSignedIn} gapi={_gapi} />
        }
        else{
            pageBody = <InfoPage />
        }

		return ( 
			//TODO: replace is signed in with ref-ing gapi directly
			<div>
				<NavBar isSignedIn={_isSignedIn} gapi={_gapi} />
                {pageBody}
			</div>
		);
	}
}

export default App;