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


    _handleSheetData(response){
        //Given the result of grabbing cell data from a sheet, prints to the terminal
        var output = "";

        console.log("RESULT OF CALL:");
        console.log(response);
        console.log(response.result);


        var range = response.result;
        if (range.values != null && range.values.length > 0) {
            console.log('Name, Major');

            for (var i = 0; i < range.values.length; i++) {
                var row = range.values[i];
                // Print columns A and E, which correspond to indices 0 and 4.
                //console.log(row[0] + ', ' + row[4]);
                output += row[0] + '\n';
            }

        } else {
            console.log("no data found, is the target spreadsheet empty?");
        }

        this.setState({sheetData: output});
    }


	_readSheetData(sheetID){
        return new Promise((resolve, reject) => {
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

            gapi.client.sheets.spreadsheets.values.get({
                spreadsheetId: sheetID,
                //TODO: could do full loads and make the assumption that the user will have local data saved to hide the download time, works because first load is expensive anyway
                //TODO: or we could figureout up to what day the user has cached to and update the last day they have cached up to the most recent day << THIS SHOULD WORK THE BEST AND IS STILL EASY
                range: this._year() + '!A1:A365'
            }).then(function(response){
                resolve(response);
            }.bind(this),
            function (response) {
                console.log('Error: ' + response.result.error.message);
            });

        });
    }


    _checkIfUserDataSSExists(userdata_sheet_name){
        return new Promise((resolve, reject) => {

            var listSheets = this.props.gapi.client.drive.files.list();
            
            console.log("RESPONSE OF LOADING FILES IS:");
            var sheetID = null;
            listSheets.execute((response) => {
                var len = response.files.length;
                if(len > 0){
                    for(var i = 0; i < response.files.length; i++){
                        //console.log(response.files[i]);
                        if(response.files[i].name == userdata_sheet_name){
                            sheetID = response.files[i].id;
                        }
                    }
                    console.log("last sheet id is: " + sheetID);
                }

                resolve(sheetID);
            });

        });
    }
    
    _createThisYearsSheet(sheetID){
        return new Promise((resolve, reject) => {
            var createSheet = this.props.gapi.client.sheets.spreadsheets.batchUpdate(
            {
                "spreadsheetId": sheetID
            },
            {
                "requests": [
                    {
                    "addSheet": {
                        "properties": {
                        "title": this._year().toString(),
                        "gridProperties": {
                            "columnCount": 1,
                            "rowCount": 365
                        }
                        }
                    }
                    }
                ]
                }
            );

            createSheet.execute((response) => {
                resolve(response);
            });
        });
    }

    _checkIfSheetExists(spreadSheetId){
        return new Promise((resolve, reject) => {
            var listSheets = this.props.gapi.client.sheets.spreadsheets.get(
                {spreadsheetId: spreadSheetId}
            );

            listSheets.execute((response) => {
                console.log(response);
                var sheetFound = false;

                for(var i = 0; i < response.sheets.length; i++){
                    console.log(this._year());
                    if(response.sheets[i].properties.title == this._year()){
                        sheetFound = true;
                        break;
                    }
                }
                resolve(sheetFound);
            });
        });
    }

    _createSheetIfNotExists(sheetExists, sheetID){
        return new Promise((resolve, reject) => {
            if(sheetExists){
                console.log("we found it boi");
                resolve(this.gapi);
            }
            else{
                console.log("Creating sheet for year " + this._year());
                this._createThisYearsSheet(sheetID).then((response) => {
                    console.log(response);
                    resolve(this.gapi);
                });
            }
        });
    }

    _createUserDataSS(userdata_sheet_name){
        return new Promise((resolve, reject) => {
            var createRequest = this.props.gapi.client.sheets.spreadsheets.create(
                { "properties": { "title": userdata_sheet_name} },
            );

            createRequest.execute((response) => {
                resolve(response);
            });
        });
    }

    _createUserDataSSIfNotExists(spreadSheetExists, userdata_sheet_name){
        return new Promise((resolve, reject) => {
            if(spreadSheetExists == false){
                this._createUserDataSS(userdata_sheet_name)
                .then((response) => {
                    resolve(response);
                });
            }
            else{
                resolve();
            }
        });
    }


    _loadAPIs(){
        return new Promise((resolve, reject) => {

            var loadDriveAPI = new Promise((resolve, reject) => {
                this.props.gapi.client.load('drive', 'v2', () => {
                    resolve();
                });
            });

            var loadSheetsAPI = new Promise((resolve, reject) => {
                this.props.gapi.client.load('sheets', 'v4', () => {
                    resolve();
                });
            });

            Promise.all([loadDriveAPI, loadSheetsAPI]).then(values => { 
                resolve();
            });

        });
    }



    render(){
        console.log("Sheet state data is:");
        console.log(this.state.sheetData);

        var USERDATA_SHEET_NAME = "StudyTrackUserData"
        var USERDATA_APPS_SCRIPT_ID = "1aF4mAD1Od_Us75EidR7XKjN_74AaT8RYNrYRss9UxaU_iwrv5402ThNj";

        if(this.props.isSignedIn && this.state.sheetData == null){

            this._loadAPIs()
            .then(() => {

                this._checkIfUserDataSSExists(USERDATA_SHEET_NAME)
                .then((spreadsheetId) =>{

                    this._createUserDataSSIfNotExists(spreadsheetId != null, USERDATA_SHEET_NAME)
                    .then(() => {

                        this._checkIfSheetExists(spreadsheetId)
                        .then((sheetExists) => {

                            this._createSheetIfNotExists(sheetExists, spreadsheetId)
                            .then(() => {

                                this._readSheetData(spreadsheetId)
                                .then((sheetDataResult) => {

                                    this._handleSheetData(sheetDataResult);

                                });
                            });
                        });
                    });
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


    // HELPER FUNCTIONS
    _year(){
        return new Date().getUTCFullYear();
    }

    _weekOfYear(){
        var d = new Date();
        var dayNum = d.getUTCDay() || 7;
        d.setUTCDate(d.getUTCDate() + 4 - dayNum);
        var yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
        return Math.ceil((((d - yearStart) / 86400000) + 1)/7)
    }
}

export default TrackPage;