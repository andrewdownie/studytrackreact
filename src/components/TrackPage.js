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


	_readSheetList(){
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

    }

    render(){
        console.log("Sheet data is:");
        console.log(this.state.sheetData);
        //TODO: the sheet is loaded here, I don't know where I should put this, as I want it to run once, to grab intial values and then cache?
        if(this.props.isSignedIn && this.state.sheetData == null){
            console.log("signed in, loaded sheets now");
            this.props.gapi.client.load('sheets', 'v4', () => {
                this._readSheetList();
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