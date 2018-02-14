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


	_readSheetData(){
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
			spreadsheetId: '1u9ljq0razYyn-yTou6e8yAoHuLnCdGKU_a7URpbeSvg',
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

    render(){
        console.log("Sheet data is:");
        console.log(this.state.sheetData);
        if(this.props.isSignedIn && this.state.sheetData == null){//TODO: is this the best way to make sure the sheet loading runs once?
            console.log("signed in, load sheets now");

            //TODO: parallel promise??
            //TODO: need to load the drive api here... need to find the signature to do this
            this.props.gapi.client.load('drive', 'v2', () => {
                //TODO: load all of the sheets this app has access to
                //TODO: then grab the (?newest?) one, and feed it into the readSheetData call

                
                //TODO: for some reason drive.list() isn't a function?
                var listRequest = this.props.gapi.client.drive.files.list();
                
                //TODO: add parameter for name of sheet
                listRequest.execute(function(response){
                    console.log("RESPONSE OF LOADING FILES IS:");
                    console.log(response.files);
                });

            });

            this.props.gapi.client.load('sheets', 'v4', () => {
                this._readSheetData();
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