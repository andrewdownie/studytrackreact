import DateUtil from "./DateUtil";

/* Interacts with Google APIs to get and send data */


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
            resolve(studyData);
        });

    });
}

const QuickLoad_LoadApisAndReturnAllStudyData= (gapiInfo) => {
    return new Promise((resolve, reject) => {
        LoadAPIs(gapiInfo)
        .then(ReadSheetData)
        .then(JsonifyRawStudyData)
        .then((studyData) => {
            resolve(studyData);
        });
    });
}

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

const ReadSheetData = (gapiInfo) => {
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
            resolve(result);
        });

    });
}


/*
const GetWeeksGoals = (gapiInfo, weekOfYear) => {
    console.log("GetWeekGoals doesnt do anything yet");
}
*/

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

const DeleteProject = (gapiInfo, deleteProjectName) => {
    var i;
    return new Promise((resolve, reject) => {
        var wok = DateUtil.WeekOfYear();
        var projName;

        //Step 1: get the lastest data from the sheet (for this week)
        var loadCurrentWeek = new Promise((resolve, reject) => {
            Get(gapiInfo, "A" + wok + ":H" + wok)
            .then((response)=>{
                resolve(response);
            });
        });

        loadCurrentWeek.then((response) => {
            //Step 1.1: unpack the data
            var wok = DateUtil.WeekOfYear();

            var weekData = [];
            for(i = 0; i < 8; i++){
                weekData.push(JSON.parse(response.result.values[0][i]));
            }
            var curProjGoals = weekData[0];

            //Step 2: make sure the project we are going to update actually exists
            var targetProjectExists = false;
            for(projName in curProjGoals){
                if(projName === deleteProjectName){
                    targetProjectExists = true;
                    break;
                }
            }

            if(targetProjectExists){
                //Step 3: update the week data
                //3.1: delete the project from project goals
                delete curProjGoals[deleteProjectName];
                weekData[0] = curProjGoals;

                //3.2: delete the project from each day of the week
                for(i = 1; i < 8; i++){
                    var dayData = weekData[i];
                    for(projName in dayData){
                        if(projName === deleteProjectName){
                            delete dayData[projName];
                            weekData[i] = dayData;
                            break;
                        }
                    }
                }
            }

            //Step 4: jsonify the contents
            var sheetInput = [];
            for(i = 0; i < 8; i++){
                sheetInput[i] = JSON.stringify(weekData[i]);
            }

            //Step 5: send the new project
            Put(gapiInfo, "A" + wok, [sheetInput])
            .then((response) => {
                resolve(weekData);
            });

        });


    });
}

const UpdateProject = (gapiInfo, editProjectData) => {
    var i;
    //TODO: get most recent version of project goals
    //TODO: check to make sure that the project that is to be edited actually exists
    //TODO: update the project that is to be edited
    //TODO: send the update

    return new Promise((resolve, reject) => {
        var wok = DateUtil.WeekOfYear();

        //Step 1: load the current project goals for the current week
        var loadCurrentWeek = new Promise((resolve, reject) => {
            Get(gapiInfo, "A" + wok + ":H" + wok)
            .then((response)=>{
                resolve(response);
            });
        });

        loadCurrentWeek.then((response) => {
            var wok = DateUtil.WeekOfYear();

            var weekData = [];
            for(i = 0; i < 8; i++){
                weekData.push(JSON.parse(response.result.values[0][i]));
            }
            var curProjGoals = weekData[0];

            var projName;

            //Step 2: make sure the project we are going to update actually exists
            var targetProjectExists = false;
            for(projName in curProjGoals){
                if(projName === editProjectData.originalName){
                    targetProjectExists = true;
                    break;
                }
            }

            if(targetProjectExists){
                //Step 3: update the week data
                //3.1: Update the project goals
                delete curProjGoals[editProjectData.originalName];
                curProjGoals[editProjectData.newName] = {};
                curProjGoals[editProjectData.newName].minGoal = editProjectData.minGoal;
                curProjGoals[editProjectData.newName].idealGoal = editProjectData.idealGoal;
                weekData[0] = curProjGoals;

                //3.2: Update the project name for each day of the week
                for(i = 1; i < 8; i++){
                    var dayData = weekData[i];
                    for(projName in dayData){
                        if(projName === editProjectData.originalName){

                            var studyTime = dayData[projName].studied;
                            delete dayData[projName];
                            dayData[editProjectData.newName] = {};
                            dayData[editProjectData.newName].studied = studyTime;
                            weekData[i] = dayData;
                            break;
                        }
                    }
                }


                //Step 4: jsonify the contents
                var sheetInput = [];
                for(i = 0; i < 8; i++){
                    sheetInput[i] = JSON.stringify(weekData[i]);
                }

                //Step 5: send the new project
                Put(gapiInfo, "A" + wok, [sheetInput])
                .then((response) => {
                    resolve(weekData);
                });
            }
            else{
                reject("We couldn't find the project you wanted to up date. Was your goals modified by another connection? Refresh and try again.");//TODO: I don't know how to provide info about why promise was rejected...
            }

        });

    });

}


const AddNewProject = (gapiInfo, newProjectData) => {
    return new Promise((resolve, reject) => {

        //Step 1: load the current project goals for the current week
        var loadCurrentGoals = new Promise((resolve, reject) => {
            Get(gapiInfo, "A" + DateUtil.WeekOfYear())//TODO: how am I gonna un-hard-code this?
            .then((response)=>{
                resolve(response);
            });
        });

        //Step 2: check for duplicates
        loadCurrentGoals.then((response) => {
            var curProjGoals;
            curProjGoals = JSON.parse(response.result.values[0]);

            var duplicateProjName = false;
            for(var projName in curProjGoals){
                if(projName === newProjectData.title){
                    duplicateProjName = true;
                    break;
                }
            }

            if(duplicateProjName){
                reject();//TODO: I don't know how to provide info about why promise was rejected...
            }
            else{
                //Step 3: send the new project
                //curProjGoals.push(newProjectData);
                curProjGoals[newProjectData.title] = {};
                curProjGoals[newProjectData.title].minGoal = newProjectData.minGoal;
                curProjGoals[newProjectData.title].idealGoal = newProjectData.idealGoal;

                var sheetInput = JSON.stringify(curProjGoals);
                Put(gapiInfo, "A" + DateUtil.WeekOfYear(), [[sheetInput]])//TODO: how am I gonna un hard code this? could just pass the date in?
                .then((response) => {
                    resolve(curProjGoals);
                });
            }

        });

    });


}

const Get = (gapiInfo, range) => {
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

const DayOfWeekToColumn = (dayOfWeek) => {
    var cols = ['B', 'C', 'D', 'E', 'F', 'G', 'H'];
    return cols[dayOfWeek];
}

const GetTodaysStudyData = (gapiInfo) => {
    return new Promise((resolve, reject) => {

        var targetCell = GetTodaysCell();
        console.log(targetCell);

        Get(gapiInfo, targetCell)
        .then((result) => {
            resolve(result);
        });

    });

}

const SetTodaysStudyData = (gapiInfo, studyData) => {
    return new Promise((resolve, reject) => {

        var targetCell = GetTodaysCell();
        // console.log(studyData);
        console.log(targetCell);


        Put(gapiInfo, targetCell, [[studyData]]);

    });
}

const GetTodaysCell = () => {
    var weekOfYear = DateUtil.WeekOfYear();
    var dayOfWeek = DateUtil.DayOfWeekFromDayOfYear(DateUtil.DayOfYear());

    var column = DayOfWeekToColumn(dayOfWeek);
    var todaysCell = column + weekOfYear;

    return todaysCell;
}

const GapiUtil = {
    QuickLoad_LoadApisAndReturnAllStudyData,
    FullLoad_LoadApisAndReturnAllStudyData,
    FillSheetIfJustCreated,
    CreateSheetIfNotExists,
    CreateSSIfNotExists,
    JsonifyRawStudyData,
    GetTodaysStudyData,
    SetTodaysStudyData,
    CheckIfSheetExists,
    InitializeGAPIInfo,
    CheckIfSSExists,
    AddNewProject,
    DeleteProject,
    ReadSheetData,
    UpdateProject,
    LoadAPIs,
    Put,
    Get,
}

export default GapiUtil;