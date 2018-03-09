/* Interacts with Google APIs to get and send data */

const JsonifyRawStudyData = (rawStudyData) => {
    console.log("jsonify raw study data");
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

const FullLoad_LoadApisAndReturnAllStudyData = (gapiInfo) => {
    // The full promise chain to loading project data */

    return new Promise((resolve, reject) => {
        LoadAPIs(gapiInfo)
        .then(CheckIfSSExists)
        .then(CreateSSIfNotExists)
        .then(CheckIfSheetExists)
        .then(CreateSheetIfNotExists)
        .then(FillSheetIfJustCreated)
        .then(ReadSheetData)
        .then(JsonifyRawStudyData)
        .then((studyData) => {
            console.log("final resolve");
            resolve(studyData);
        });

    });
}

const QuickLoad_ReturnRelevantStudyData = (gapiInfo) => {
    // After the full load is taken place, a local persitant varaible should be updated to reflect that all data has been loaded and cached locally
    // If there is cached study data, we can assume the spreadsheet and the sheet exists, and load from the sheet directly using the cache spreadsheet id

    //TODO: do I need to load apis or will they be saved locally?
    //TODO: ReadStudyData by passing in the sheet id from local cache into the gapiInfo object and calling ReadStudyData
}

const ReadSheetData = (gapiInfo) => {
    console.log("read sheet data");
    return new Promise((resolve, reject) => {
        var gapi = gapiInfo.gapi;

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

        Get(gapiInfo, "A1:H53")
        .then((result) =>{
            console.log(result);
            resolve(result);
        });

        /*gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: gapiInfo.spreadsheet.id,
            //TODO: could do full loads and make the assumption that the user will have local data saved to hide the download time, works because first load is expensive anyway
            //TODO: or we could figureout up to what day the user has cached to and update the last day they have cached up to the most recent day << THIS SHOULD WORK THE BEST AND IS STILL EASY
            range: gapiInfo.studysheet.title + '!A1:H53'
        }).then(function(response){
            resolve(response);
        },//.bind(this),
        function (response) {
            console.log('Error: ' + response.result.error.message);
        });*/

    });
}


const GetWeeksGoals = (gapiInfo, weekOfYear) => {
    console.log("GetWeekGoals doesnt do anything yet");
}

const CheckIfSSExists = (gapiInfo) => {
    return new Promise((resolve, reject) => {

        var listSheets = gapiInfo.gapi.client.drive.files.list();
        
        listSheets.execute((response) => {
            var len = response.files.length;
            if(len > 0){
                for(var i = 0; i < response.files.length; i++){
                    //console.log(response.files[i]);
                    if(response.files[i].name === gapiInfo.spreadsheet.title){
                        gapiInfo.spreadsheet.id = response.files[i].id;
                        gapiInfo.spreadsheet.exists = true;
                    }
                }
            }
            resolve(gapiInfo);
        });

    });
}

const CheckIfSheetExists = (gapiInfo) => {

    return new Promise((resolve, reject) => {
        if(gapiInfo.spreadsheet.justCreated){
            gapiInfo.studysheet.exists = false;
            resolve(gapiInfo);
        }
        else{
            var listSheets = gapiInfo.gapi.client.sheets.spreadsheets.get(
                {spreadsheetId: gapiInfo.spreadsheet.id}
            );

            listSheets.execute((response) => {
                gapiInfo.studysheet.exists = false;

                for(var i = 0; i < response.sheets.length; i++){
                    //console.log(this._year());
                    if(response.sheets[i].properties.title === gapiInfo.studysheet.title){
                        gapiInfo.studysheet.exists = true;
                        break;
                    }
                }
                resolve(gapiInfo);
            });
        }

    });
}

const CreateSheetIfNotExists = (gapiInfo) => {

    console.log("create sheet if not exists");
    console.log(gapiInfo);

    return new Promise((resolve, reject) => {
        if(gapiInfo.studysheet.exists){
            resolve(gapiInfo);
        }
        else{
            var createSheet = gapiInfo.gapi.client.sheets.spreadsheets.batchUpdate(
            {
                "spreadsheetId": gapiInfo.spreadsheet.id
            },
            {
                "requests": [
                    {
                        "addSheet": {
                            "properties": {
                                "title": gapiInfo.studysheet.title,
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
                gapiInfo.studysheet.exists = true;
                gapiInfo.studysheet.justCreated = true;
                resolve(gapiInfo);
            });

        }
    });
}

const UpdateProject = (gapiInfo, editProjectData) => {
    console.log("this is update project");
}


const AddNewProject = (gapiInfo, newProjectData) => {
    return new Promise((resolve, reject) => {

        //Step 1: load the current project goals for the current week
        var loadCurrentGoals = new Promise((resolve, reject) => {
            Get(gapiInfo, "A10")//TODO: how am I gonna un-hard-code this?
            .then((response)=>{
                resolve(response);
            });
        });

        //Step 2: check for duplicates
        loadCurrentGoals.then((response) => {
            var curProjGoals;
            console.log(response.result.values[0]);
            curProjGoals = JSON.parse(response.result.values[0]);

            var duplicateProjName = false;
            for(var projName in curProjGoals){
                console.log(projName);
                if(projName === newProjectData.title){
                    duplicateProjName = true;
                    break;
                }
            }

            if(duplicateProjName){
                console.log("There was a project with a duplicate name");
                reject();//TODO: I don't know how to provide info about why promise was rejected...
            }
            else{
                //Step 3: send the new project
                console.log("Push the new project data to the sheet here.");
                //curProjGoals.push(newProjectData);
                curProjGoals[newProjectData.title] = {};
                curProjGoals[newProjectData.title].minGoal = newProjectData.minGoal;
                curProjGoals[newProjectData.title].idealGoal = newProjectData.idealGoal;

                var sheetInput = JSON.stringify(curProjGoals);
                Put(gapiInfo, "A10", [[sheetInput]])//TODO: how am I gonna un hard code this? could just pass the date in?
                .then((response) => {
                    resolve(curProjGoals);
                });
            }

        });

    });


}

const Get = (gapiInfo, range) => {
    console.log("get");
    return new Promise((resolve, reject) =>{
        gapiInfo.gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: gapiInfo.spreadsheet.id,
            range: gapiInfo.studysheet.title + '!' + range,
        }).then(function(response){
            resolve(response);
        },//.bind(this),//TODO: what does this serve in this context?
        function (response) {
            console.log('Error: ' + response.result.error.message);
        });
    });
}

//TODO: create a method to send arbitrary data to the sheet (everything sent in parameters)
//TODO: give the function / parameter a better name....
//TODO: oh fuk it needs gapi /and/or gapiInfo
const Put = (gapiInfo, range, values) => {
    return new Promise((resolve, reject) => {
        var sendDataRequest = gapiInfo.gapi.client.sheets.spreadsheets.values.batchUpdate(
        {
            "spreadsheetId": gapiInfo.spreadsheet.id
        },
        {
            "data": [
                {
                "values": values,
                "range": gapiInfo.studysheet.title + "!" + range
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

const FillSheetIfJustCreated = (gapiInfo) => {
    console.log("fill sheet if just created");
    return new Promise((resolve, reject) => {
        //TODO: create a list of 63 week objects, and place them into the target sheet

        if(gapiInfo.studysheet.justCreated === false){
            resolve(gapiInfo);
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


            Put(gapiInfo, "A1:H53", rows)
            .then((result) => {
                resolve(gapiInfo);
            });

        }

    });
}

const CreateSSIfNotExists = (gapiInfo) => {
    return new Promise((resolve, reject) => {

        if(gapiInfo.spreadsheet.exists === false){
            var createRequest = gapiInfo.gapi.client.sheets.spreadsheets.create(
                { "properties": { "title": gapiInfo.spreadsheet.title} },
            );

            createRequest.execute((response) => {
                console.log(response);
                gapiInfo.spreadsheet.id = response.spreadsheetId;
                gapiInfo.spreadsheet.exists = true;
                gapiInfo.spreadsheet.justCreated = true;
                resolve(gapiInfo);
            });

        }
        else{
            resolve(gapiInfo);
        }
    });
}


const LoadAPIs = (gapiInfo) => {
    return new Promise((resolve, reject) => {

        var loadDriveAPI = new Promise((resolve, reject) => {
            gapiInfo.gapi.client.load('drive', 'v2', () => {
                resolve();
            });
        });

        var loadSheetsAPI = new Promise((resolve, reject) => {
            gapiInfo.gapi.client.load('sheets', 'v4', () => {
                resolve();
            });
        });

        Promise.all([loadDriveAPI, loadSheetsAPI]).then(values => { 
            resolve(gapiInfo);
        });

    });
}

const InitializeGAPIInfo = (gapi, studySheetName) => {
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
    InitializeGAPIInfo,
    FillSheetIfJustCreated,
    CreateSheetIfNotExists,
    CreateSSIfNotExists,
    JsonifyRawStudyData,
    CheckIfSheetExists,
    CheckIfSSExists,
    AddNewProject,
    ReadSheetData,
    UpdateProject,
    LoadAPIs,
    Put,
    Get,
}

export default gapi_util;