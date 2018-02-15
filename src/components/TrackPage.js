import {Grid, Row, Col} from 'react-bootstrap';
import React, { Component } from 'react';

import TrackProjects from './TrackProjects';
import PreviousWeeks from './PreviousWeeks';
import Today from './Today';

//TODO: does this actually need to be a class?
class TrackPage extends Component {

    constructor(props){
        super(props);

        this.state = {sheetData: null};
    }


	_readSheetData(sheetID){
        var gapi = this.props.gapi;

        if(!gapi){
            return "";
        }
        if(!gapi.client){
            return "";
        }
        if(!gapi.client.sheets){
            return "";
        }

        //TODO: make it load the correct sheet by default
		gapi.client.sheets.spreadsheets.values.get({
            //spreadsheetId: '1u9ljq0razYyn-yTou6e8yAoHuLnCdGKU_a7URpbeSvg',
            spreadsheetId: sheetID,
			range: 'A1:E1',
        }).then(function(response){
            var output = "";

            console.log("RESULT OF CALL:");
            console.log(response);
            console.log(response.result);


            var range = response.result;
            if (range.values.length > 0) {
                console.log('Name, Major');

                for (var i = 0; i < range.values.length; i++) {
                    var row = range.values[i];
                    // Print columns A and E, which correspond to indices 0 and 4.
                    //console.log(row[0] + ', ' + row[4]);
                    output += row[0] + ', ' + row[4] + '\n';
                }

            } else {
                console.log("no data found");
            }

            this.setState({sheetData: output});

        }.bind(this),
        function (response) {
			console.log('Error: ' + response.result.error.message);
        });

    }

    //TODO: using this method to just try to get this working using setState...
    _ParseSheetDataFromAjax(response){
        var output = "";

        console.log("RESULT OF CALL:");
        console.log(response);
        console.log(response.result);


        var range = response.result;
        console.log(range);
        if (range.values.length > 0) {
            console.log('Name, Major');

            for (var i = 0; i < range.values.length; i++) {
                var row = range.values[i];
                // Print columns A and E, which correspond to indices 0 and 4.
                //console.log(row[0] + ', ' + row[4]);
                output += row[0] + ', ' + row[4] + '\n';
            }

        } else {
            console.log("no data found");
        }
        console.log("Setting sheet data to: " + output);
        this.setState({sheetData: output});

    }

    _weekOfYear(){
        var d = new Date();
        var dayNum = d.getUTCDay() || 7;
        d.setUTCDate(d.getUTCDate() + 4 - dayNum);
        var yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
        return Math.ceil((((d - yearStart) / 86400000) + 1)/7)
    }

    _sheetName(){
        var d = new Date();
        return d.getFullYear().toString().substr(-2) + this._weekOfYear();
    }

    _lastWeeksSheetName(){
        var d = new Date();
        return d.getFullYear().toString().substr(-2) + (this._weekOfYear() - 1);
    }


    _findUserDataSheet(){
        return new Promise((resolve, reject) => {

            //TODO: I don't know where to put this atm, should I create a component full of static vars that holds all the google connection setup data?
            var USERDATA_SHEET_NAME = "StudyTrackUserData"
            console.log("signed in, load sheets now");

            this.props.gapi.client.load('drive', 'v2', () => {

                
                var listRequest = this.props.gapi.client.drive.files.list();
                
                console.log("RESPONSE OF LOADING FILES IS:");
                //TODO: add parameter for name of sheet
                var sheetID = null;
                listRequest.execute((response) => {
                    var len = response.files.length;
                    if(len > 0){
                        for(var i = 0; i < response.files.length; i++){
                            //console.log(response.files[i]);
                            if(response.files[i].name == USERDATA_SHEET_NAME){
                                sheetID = response.files[i].id;
                            }
                        }
                        console.log("last sheet id is: " + sheetID);
                    }

                    if(sheetID == null){
                        //TODO: create a userdata spreadsheet for the user somewhere around here
                        console.log("no userdata sheet found, creating a new one now...");
                        reject(sheetID);
                    }
                    else{
                        resolve(sheetID);
                    }
                });
            });

        });
    }


    render(){
        console.log("Sheet data is:");
        console.log(this.state.sheetData);


        if(this.props.isSignedIn && this.state.sheetData == null){//TODO: is this the best way to make sure the sheet loading runs once?
            this._findUserDataSheet().then((sheetID) =>{

                this.props.gapi.client.load('sheets', 'v4', () => {
                    this._readSheetData(sheetID);
                });

            });
        }

        var gapi = this.props.gapi;
        return(
        <Grid>
            <Row className="show-grid">
                <Col xs={12} >
                    <h1>This is TrackPage.js</h1>
                </Col>
                <Col xs={12} >
                    <p>{this.state.sheetData}</p>
                </Col>
            </Row>
            

            <TrackProjects />
            <Today />
            <PreviousWeeks />
        </Grid>
        );
    }

}

export default TrackPage;