/* Interacts with Google APIs to get and send data */

const JsonifyRawStudyData = (rawStudyData) => {
    return new Promise((resolve, reject) => {
        var studyData = [];
        if(rawStudyData.result.values != null && rawStudyData.result.values.length > 0){

            // Go through each row of the sheet
            for(var i = 0; i < rawStudyData.result.values.length; i++){
                var rowData = [];

                //Go thorugh each cell in the current row, and jsonify it's contents
                for(var j = 0; j < rawStudyData.result.values[i].length; j++){
                    var jsonData = JSON.parse(rawStudyData.result.values[i][j]);
                    rowData.push(jsonData);
                }
                studyData.push(rowData);
            }
            
        }

        resolve(studyData);
    });

}

const FullLoad_LoadApisAndReturnAllStudyData = (chaindata) => {
    // The full promise chain to loading project data */

    return new Promise((resolve, reject) => {
        LoadAPIs(chaindata)
        .then(CheckIfSSExists)
        .then(CreateSSIfNotExists)
        .then(CheckIfSheetExists)
        .then(CreateSheetIfNotExists)
        .then(FillSheetIfJustCreated)
        .then(ReadSheetData)
        .then(JsonifyRawStudyData)
        .then((studyData) => {
            resolve(studyData);
        });

    });
}

const QuickLoad_ReturnRelevantStudyData = (chaindata) => {
    // After the full load is taken place, a local persitant varaible should be updated to reflect that all data has been loaded and cached locally
    // If there is cached study data, we can assume the spreadsheet and the sheet exists, and load from the sheet directly using the cache spreadsheet id

    //TODO: do I need to load apis or will they be saved locally?
    //TODO: ReadStudyData by passing in the sheet id from local cache into the chaindata object and calling ReadStudyData
}

const ReadSheetData = (chaindata) => {
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
            range: chaindata.studysheet.title + '!A1:H53'
        }).then(function(response){
            resolve(response);
        },//.bind(this),
        function (response) {
            console.log('Error: ' + response.result.error.message);
        });

    });
}

const CheckIfSSExists = (chaindata) => {
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

const CheckIfSheetExists = (chaindata) => {

    return new Promise((resolve, reject) => {
        if(chaindata.spreadsheet.justCreated){
            chaindata.studysheet.exists = false;
            resolve(chaindata);
        }
        else{
            var listSheets = chaindata.gapi.client.sheets.spreadsheets.get(
                {spreadsheetId: chaindata.spreadsheet.id}
            );

            listSheets.execute((response) => {
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
        }

    });
}

const CreateSheetIfNotExists = (chaindata) => {

    return new Promise((resolve, reject) => {
        if(chaindata.studysheet.exists){
            resolve(chaindata);
        }
        else{
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
                                    "columnCount": 8,
                                    "rowCount":53
                                }
                            }
                        }
                    }
                ]
                }
            );

            createSheet.execute((response) => {
                chaindata.studysheet.exists = true;
                chaindata.studysheet.justCreated = true;
                resolve(chaindata);
            });

        }
    });
}

//TODO: create a method to send arbitrary data to the sheet (everything sent in parameters)
//TODO: give the function / parameter a better name....
//TODO: oh fuk it needs gapi /and/or chaindata
const SendData = (chaindata, range, values) => {
    return new Promise((resolve, reject) => {
        console.log("This is SendData --- ");
        console.log(chaindata);

        var sendDataRequest = chaindata.gapi.client.sheets.spreadsheets.values.batchUpdate(
        {
            "spreadsheetId": chaindata.spreadsheet.id
        },
        {
            "data": [
                {
                "values": values,
                "range": chaindata.studysheet.title + "!" + range
                }
            ],
            "valueInputOption": "RAW"
            }
        );

        sendDataRequest.execute((response) => {
            resolve(response);
        });

    });
}

const FillSheetIfJustCreated = (chaindata) => {
    return new Promise((resolve, reject) => {
        //TODO: create a list of 63 week objects, and place them into the target sheet

        if(chaindata.studysheet.justCreated === false){
            resolve(chaindata);
        }
        else{
            var rows = [];
            for(var i = 0; i < 53; i++){
                //curRow = sheetdata_util.CreateWeekData();
                var curRow = [];
                for(var j = 0; j < 8; j++){
                    curRow.push("{}");
                }
                rows.push(curRow);
            }

            console.log(rows);

            var updateRequest = chaindata.gapi.client.sheets.spreadsheets.values.batchUpdate(
            {
                "spreadsheetId": chaindata.spreadsheet.id
            },
            {
                "data": [
                    {
                    "values": rows,
                    "range": "2018!A1:H53"
                    }
                ],
                "valueInputOption": "RAW"
                }
            );

            updateRequest.execute((response) => {
                //TODO: how do I check for success / failure
                resolve(chaindata);
                console.log("after request");
            }, (reason) => {
                console.log("filling new sheet with default values failed.");
                console.log(reason);
            }, (reason) => {
                console.log(reason);
            });

        }

    });
}

const CreateSSIfNotExists = (chaindata) => {
    return new Promise((resolve, reject) => {

        if(chaindata.spreadsheet.exists === false){
            var createRequest = chaindata.gapi.client.sheets.spreadsheets.create(
                { "properties": { "title": chaindata.spreadsheet.title} },
            );

            createRequest.execute((response) => {
                chaindata.spreadsheet.id = response.id;
                chaindata.spreadsheet.exists = true;
                chaindata.spreadsheet.justCreated = true;
                resolve(chaindata);
            });

        }
        else{
            resolve(chaindata);
        }
    });
}


const LoadAPIs = (chaindata) => {
    return new Promise((resolve, reject) => {

        var loadDriveAPI = new Promise((resolve, reject) => {
            chaindata.gapi.client.load('drive', 'v2', () => {
                resolve();
            });
        });

        var loadSheetsAPI = new Promise((resolve, reject) => {
            chaindata.gapi.client.load('sheets', 'v4', () => {
                resolve();
            });
        });

        Promise.all([loadDriveAPI, loadSheetsAPI]).then(values => { 
            resolve(chaindata);
        });

    });
}

const InitializeGAPIChainData = (gapi, studySheetName) => {
    return {
        gapi: gapi,
        spreadsheet: {
            exists: false,
            justCreated: false,
            title: "StudyTrackUserData",
            id: null
        },
        studysheet: {
            exists: false,
            justCreated: false,
            title: studySheetName.toString()
        }
    };
}

const gapi_util = {
    FullLoad_LoadApisAndReturnAllStudyData,
    QuickLoad_ReturnRelevantStudyData,
    InitializeGAPIChainData,
    FillSheetIfJustCreated,
    CreateSheetIfNotExists,
    CreateSSIfNotExists,
    JsonifyRawStudyData,
    CheckIfSheetExists,
    CheckIfSSExists,
    ReadSheetData,
    LoadAPIs,
    SendData,
}

export default gapi_util;