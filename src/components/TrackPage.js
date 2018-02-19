import {Grid, Row, Col} from 'react-bootstrap';
import React, { Component } from 'react';

import TrackProjects from './TrackProjects';
import PreviousWeeks from './PreviousWeeks';
import Today from './Today';

//TODO: does this actually need to be a class?
class TrackPage extends Component {

    constructor(props){
        super(props);

        this.state = {studyData: null};
    }


    _addStudyDataToPage(response){
        //Given the result of grabbing cell data from a sheet, prints to the terminal
        //var output = "";

        console.log("RESULT OF CALL:");
        console.log(response);
        console.log(response.result);


        var range = response.result;
        if (range.values != null && range.values.length > 0) {

            for (var i = 0; i < range.values.length; i++) {
                //var row = range.values[i];
                //output += row[0] + '\n';
            }

        } else {
            console.log("no data found, is the target spreadsheet empty?");
        }

        //this.setState({sheetData: output});
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
                range: chaindata.studysheet.title + '!A1:A365'
            }).then(function(response){
                resolve(response);
            },//.bind(this),
            function (response) {
                console.log('Error: ' + response.result.error.message);
            });

        });
    }


    _checkIfSSExists(chaindata){
        return new Promise((resolve, reject) => {

            var listSheets = chaindata.gapi.client.drive.files.list();
            
            listSheets.execute((response) => {
                var len = response.files.length;
                if(len > 0){
                    for(var i = 0; i < response.files.length; i++){
                        //console.log(response.files[i]);
                        if(response.files[i].name === chaindata.spreadsheet.title){
                            chaindata.spreadsheet.id = response.files[i].id;
                            chaindata.spreadsheet.exists = true;
                        }
                    }
                }
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
                    //console.log(this._year());
                    if(response.sheets[i].properties.title === chaindata.studysheet.title){
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
                resolve(chaindata);
            }
            else{
                console.log("create study sheet now");
                var createSheet = chaindata.gapi.client.sheets.spreadsheets.batchUpdate(
                {
                    "spreadsheetId": chaindata.spreadsheet.id
                },
                {
                    "requests": [
                        {
                        "addSheet": {
                            "properties": {
                            "title": chaindata.studysheet.title,
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
                    console.log(response);
                    chaindata.studysheet.exists = true;
                    resolve(chaindata);
                });

            }
        });
    }

    _createSSIfNotExists(chaindata){
        return new Promise((resolve, reject) => {

            if(chaindata.spreadsheet.exists === false){
                var createRequest = chaindata.gapi.client.sheets.spreadsheets.create(
                    { "properties": { "title": chaindata.spreadsheet.name} },
                );

                createRequest.execute((response) => {
                    chaindata.spreadsheet.id = response.id;
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
                resolve(chaindata);
            });

        });
    }

    _setupJsonProject(projectName){
        return{
            projectName: projectName,
            studyTimeMS: 0
        };
    }

    _initializeChainData(gapi){
        return {
            gapi: gapi,
            spreadsheet: {
                exists: false,
                title: "StudyTrackUserData",
                id: null
            },
            studysheet: {
                exists: false,
                title: this._year().toString()
            }
        };
    }

    _findTodaysData(studyData){


        if(studyData == null){
            console.log("wtf> study data was null in find todays data");
            return null;
        }
        console.log("notwtf> study data was not null in find todays data");
        console.log(studyData);

        var today = parseInt(this._dayOfYear(), 10);
        var todaysData = null;

        console.log(today - 1);
        //TODO: why is study data undefined
        console.log(studyData.length);
        if(studyData.length >= today - 1){
            todaysData = studyData[today - 1];
        }

        return todaysData;
    }

    _findWeeksData(weekOfYear){

    }


    _initializeAPIsAndGetStudyData(chaindata){
        this._loadAPIs(chaindata)
        .then(this._checkIfSSExists)
        .then(this._createSSIfNotExists)
        .then(this._checkIfSheetExists)
        .then(this._createSheetIfNotExists)
        .then(this._readStudyData)
        .then((response) => {
            this.setState({studyData: response});
        });
    }


    render(){
        var studyData = null;
        if(this.state.studyData != null){
            studyData = this.state.studyData.result.values;
        }

        console.log("(meow)study data is: ");
        console.log(studyData);

        //TODO: why doesn't the correct data make it in???
        var todaysData = this._findTodaysData(studyData);
        console.log("todays data is: ");
        console.log(todaysData);

        if(this.props.isSignedIn && this.state.studyData == null){
            var chaindata = this._initializeChainData(this.props.gapi);
            studyData = this._initializeAPIsAndGetStudyData(chaindata);
        }

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
            <Today todaysData={todaysData} />
            <PreviousWeeks />
        </Grid>
        );
    }

    _dayOfYear(){
        //https://stackoverflow.com/questions/8619879/javascript-calculate-the-day-of-the-year-1-366
        var now = new Date();
        var start = new Date(now.getFullYear(), 0, 0);
        var diff = (now - start) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
        var oneDay = 1000 * 60 * 60 * 24;
        var day = Math.floor(diff / oneDay);
        return day;
    }

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