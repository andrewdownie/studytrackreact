const ReadStudyData = (chaindata) => {
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
            range: chaindata.studysheet.title + '!A1:A53'
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
                            "columnCount": 1,
                            "rowCount":53
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

const CreateSSIfNotExists = (chaindata) => {
    return new Promise((resolve, reject) => {

        if(chaindata.spreadsheet.exists === false){
            var createRequest = chaindata.gapi.client.sheets.spreadsheets.create(
                { "properties": { "title": chaindata.spreadsheet.title} },
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
            title: "StudyTrackUserData",
            id: null
        },
        studysheet: {
            exists: false,
            title: studySheetName.toString()
        }
    };
}


const gapi_util = {
    LoadAPIs,
    CreateSheetIfNotExists,
    CreateSSIfNotExists,
    CheckIfSheetExists,
    CheckIfSSExists,
    ReadStudyData,
    InitializeGAPIChainData,
}
export default gapi_util;