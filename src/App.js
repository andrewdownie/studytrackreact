import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';


import NavBar from './components/NavBar';

class App extends Component {


  //SOURCES:
  //  - https://www.reddit.com/r/reactjs/comments/67cqzr/using_the_google_api_in_a_react_app_need_a_bit_of/
  //  - https://github.com/dmison/polydactyl/blob/master/src/components/App.jsx
  componentDidMount(){
      console.log("Component did mount");

      require('google-client-api')().then((gapi)=>{
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
          // Listen for sign-in state changes.
          gapi.auth2.getAuthInstance().isSignedIn.listen(this._updateSigninStatus);



          this.setState({gapi: gapi}, ()=>{
            // Handle the initial sign-in state.
            this._updateSigninStatus(this.state.gapi.auth2.getAuthInstance().isSignedIn.get());
          });


          //TODO: redo this with a promise?
          gapi.client.load('sheets', 'v4', () => {
            // TODO: currently passing the gapi is a parm, how the hell do you actually manage the gapi in react?
            //    TODO: someone said they have it load on a base component, and then refernece it from there in all child compoents somehow?
            this._readSheetList(gapi);
          });
  
        }.bind(this));
      });
  }


  _readSheetList(gapi){
    //This is to test api call using gapi object

    // Apprently this is being called after gapi.client is loaded, but before gapi.client.sheets is loaded
    gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: '1u9ljq0razYyn-yTou6e8yAoHuLnCdGKU_a7URpbeSvg',
      range: 'Class Data!A2:E',
    }).then(function(response) {
      var range = response.result;
      if (range.values.length > 0) {
        //appendPre('Name, Major:');
        console.log('Name, Major');
        for (var i = 0; i < range.values.length; i++) {
          var row = range.values[i];
          // Print columns A and E, which correspond to indices 0 and 4.
          //appendPre(row[0] + ', ' + row[4]);
          console.log(row[0] + ', ' + row[4]);
        }
      } else {
        //appendPre('No data found.');
        console.log("no data found");
      }
    }, function(response) {
      //appendPre('Error: ' + response.result.error.message);
      console.log('Error: ' + response.result.error.message);
    });


  }

  // {THIS ISN'T MY CODES }
  // I dont really get what this does atm, but it doesn't cause errors, so that's nice
  _updateSigninStatus(isSignedIn) {

    if(isSignedIn){
      this.state.gapi.client.people.people.get({ resourceName: 'people/me' }).then((result)=>{
        this.setState({loginName: result.result.names[0].givenName});
      });
    } else {
      this.setState({loginName: ''});
    }

    this.setState({signedIn: isSignedIn});
  }

  render() {
    return (
      <NavBar/>
    );
  }
}

export default App;
