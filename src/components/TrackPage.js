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


    _addStudyDataToPage(response){
        //Given the result of grabbing cell data from a sheet, prints to the terminal
        var output = "";

        console.log("RESULT OF CALL:");
        console.log(response);
        console.log(response.result);


        var range = response.result;
        if (range.values != null && range.values.length > 0) {

            for (var i = 0; i < range.values.length; i++) {
                var row = range.values[i];
                output += row[0] + '\n';
            }

        } else {
            console.log("no data found, is the target spreadsheet empty?");
        }

        this.setState({sheetData: output});
    }


	_readStudyData(chaindata){
        return new Promise((resolve, reject) => {
            var gapi = chaindata.gapi;

            //TODO: do I still need these checks?
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
                spreadsheetId: chaindata.spreadsheet.id,
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


    _checkIfUserDataSSExists(chaindata){
        return new Promise((resolve, reject) => {

            var listSheets = this.props.gapi.client.drive.files.list();
            
            console.log("RESPONSE OF LOADING FILES IS:");
            listSheets.execute((response) => {
                var len = response.files.length;
                if(len > 0){
                    for(var i = 0; i < response.files.length; i++){
                        //console.log(response.files[i]);
                        if(response.files[i].name == chaindata.spreadsheet.name){
                            chaindata.spreadsheet.id = response.files[i].id;
                            chaindata.spreadsheet.exists = true;
                        }
                    }
                    console.log("last sheet id is: " + chaindata.spreadsheet.id);
                }

                resolve(chaindata);
            });

        });
    }
    
    _createSheet(chaindata){
        return new Promise((resolve, reject) => {
            var createSheet = chaindata.gapi.client.sheets.spreadsheets.batchUpdate(
            {
                "spreadsheetId":chaindata.spreadsheet.id
            },
            {
                "requests": [
                    {
                    "addSheet": {
                        "properties": {
                        "title": chaindata.studysheet.name,
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

            createSheet.execute(() => {
                resolve(chaindata);
            });
        });
    }

    _checkIfSheetExists(chaindata){
        return new Promise((resolve, reject) => {
            var listSheets = chaindata.gapi.client.sheets.spreadsheets.get(
                {spreadsheetId: chaindata.spreadsheet.id}
            );

            listSheets.execute((response) => {
                console.log(response);
                chaindata.studysheet.exists = false;

                for(var i = 0; i < response.sheets.length; i++){
                    console.log(this._year());
                    if(response.sheets[i].properties.title == this._year()){
                        chaindata.studysheet.exists = true;
                        break;
                    }
                }
                resolve(chaindata);
            });
        });
    }

    _createSheetIfNotExists(chaindata){
        return new Promise((resolve, reject) => {
            if(chaindata.studysheet.exists){
                console.log("no need to create sheet");
                resolve(chaindata);
            }
            else{
                console.log("Creating sheet for year " + this._year());
                this._createSheet(chaindata.spreadsheet.id).then((response) => {
                    console.log(response);
                    chaindata.studysheet.exists = true;
                    resolve(chaindata);
                });
            }
        });
    }

    _createUserDataSS(chaindata){
    return new Promise((resolve, reject) => {
            var createRequest = this.props.gapi.client.sheets.spreadsheets.create(
                { "properties": { "title": chaindata.spreadsheet.name} },
            );

            createRequest.execute((response) => {
                chaindata.spreadsheet.exists = true;
                resolve(chaindata);
            });
        });
    }

    _createUserDataSSIfNotExists(chaindata){
        return new Promise((resolve, reject) => {
            if(chaindata.spreadsheet.exists == false){
                this._createUserDataSS(chaindata.spreadsheet.name)
                .then((response) => {
                    chaindata.spreadsheet.exists = true;
                    resolve(chaindata);
                });
            }
            else{
                resolve(chaindata);
            }
        });
    }


    _loadAPIs(chaindata){
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
                //TODO: create chain data structure here
                resolve(chaindata);
            });

        });
    }

    _initializeChainData(gapi){
        return {
            gapi: gapi,
            spreadsheet: {
                exists: false,
                name: "StudyTrackUserData",
                id: null
            },
            projectsheet: {
                exists: false,
                name: this._year() + "-study"
            },
            studysheet: {
                exists: false,
                name: this._year() + "-projects"
            }
        };
    }



    render(){
        console.log("Sheet state data is:");
        console.log(this.state.sheetData);

        if(this.props.isSignedIn && this.state.sheetData == null){
            var chaindata = this._initializeChainData(this.props.gapi);

            this._loadAPIs(chaindata)
            .then((chaindata) => {

                this._checkIfUserDataSSExists(chaindata)
                .then((chaindata) =>{

                    this._createUserDataSSIfNotExists(chaindata)
                    .then((chaindata) => {

                        this._checkIfSheetExists(chaindata)
                        .then((chaindata) => {

                            this._createSheetIfNotExists(chaindata)
                            .then((chaindata) => {

                                this._readStudyData(chaindata)
                                .then((sheetDataResult) => {

                                    this._addStudyDataToPage(sheetDataResult);

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