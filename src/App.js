import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';


import NavBar from './components/NavBar';

class App extends Component {


  //SOURCES:
  //  - https://www.reddit.com/r/reactjs/comments/67cqzr/using_the_google_api_in_a_react_app_need_a_bit_of/
  //  - https://github.com/dmison/polydactyl/blob/master/src/components/App.jsx
  componentDidMount(){
      require('google-client-api')().then((gapi)=>{
        console.log('initializing GAPI...');
        var CLIENT_ID = '1083074050385-cgb3btfhipjd45mhhecoiiqkug8noon9.apps.googleusercontent.com';
        var DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest', 'https://people.googleapis.com/$discovery/rest'];
        var SCOPES = 'https://www.googleapis.com/auth/gmail.send profile';
  
        gapi.client.init({
          discoveryDocs: DISCOVERY_DOCS,
          clientId: CLIENT_ID,
          scope: SCOPES
        }).then(function () {
          console.log('GAPI Initialized.');
          // Listen for sign-in state changes.
          gapi.auth2.getAuthInstance().isSignedIn.listen(this._updateSigninStatus);
          this.setState({gapi: gapi}, ()=>{
            // Handle the initial sign-in state.
            this._updateSigninStatus(this.state.gapi.auth2.getAuthInstance().isSignedIn.get());
          });
  
        }.bind(this));
      });
  }

  render() {
    return (
      <NavBar/>
    );
  }
}

export default App;
