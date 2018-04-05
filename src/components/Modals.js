import {Modal, Button} from 'react-bootstrap';
import FaSpinner from 'react-icons/lib/fa/spinner';
import React, {Component} from 'react';


class ProjectModals extends Component{
    constructor(props){
        super(props);


        this.state = { //NOTE: be sure to update componentWillRecieveProps as well
            //show: props.showAddProject
            studySession_selectedProject: "Loading projects...",
            studySession_minutes: 30,
            studySession_hours: 0,
            startStudySession: props.startStudySession,
            showAddModal: props.showAddModal,
            showEditProject: props.showEditProject,
            showStudyModal: props.showStudyModal,
            showLoadingModal: props.showLoadingModal,
            showQuickWarningModal: props.showQuickWarningModal,
            showStudyWarningModal: props.showStudyWarningModal,
            addProjectCallback: props.addProjectCallback,
            loadingModalMessage: props.loadingModalMessage,
            editProjectCallback: props.editProjectCallback,
            deleteProjectCallback: props.deleteProjectCallback,
            cancelStudySession: props.cancelStudySession,
            closeModals: props.closeModals,
            addProject_name: "",
            addProject_minGoal: 2,
            addProject_idealGoal: 5,
            editProject_name: "",
            editProject_originalName: "",
            editProject_minGoal: 2,
            editProject_idealGoal: 5,
            projectNames: [],
        };

        this.startStudySession = this.startStudySession.bind(this);
        this.deleteProject = this.deleteProject.bind(this);
        this.editProject = this.editProject.bind(this);
        this.addProject = this.addProject.bind(this);

    }

    //TODO: this will be called even when the props havent changed, need to check to see if they've changed or not?
    componentWillReceiveProps(nextProps){
        var selectedProject = this.state.studySession_selectedProject;

        if(nextProps.projectNames && nextProps.projectNames.length > 0 && this.state.studySession_selectedProject === "Loading projects..."){
            //this.state.studySession_selectedProject = nextProps.projectNames[0];
            selectedProject = nextProps.projectNames[0];
        }

        var newProjectNames = nextProps.projectNames;
        if(newProjectNames === null){
            newProjectNames = [];
        }

        //TODO: do I need to set get the studySession minutes/hours? I don't think so, it's gonna be two way bound, and then shipped when the user presses the final enter button
        this.setState({
            loadingModalMessage: nextProps.loadingModalMessage,
            showEditProject: nextProps.showEditProject,
            showLoadingModal: nextProps.showLoadingModal,
            showAddModal: nextProps.showAddModal,
            showStudyModal: nextProps.showStudyModal,
            showQuickWarningModal: nextProps.showQuickWarningModal,
            showStudyWarningModal: nextProps.showStudyWarningModal,
            addProjectCallback: nextProps.addProjectCallback,
            editProject_name: nextProps.editProject_name,
            editProject_originalName: nextProps.editProject_name,
            editProject_minGoal: nextProps.editProject_minGoal,
            editProject_idealGoal: nextProps.editProject_idealGoal,
            projectNames: newProjectNames,
            startStudySession: nextProps.startStudySession,
            studySession_selectedProject: selectedProject,
        });
    }


    addProject(){
        this.state.addProjectCallback({
            title: this.state.addProject_name,
            minGoal: this.state.addProject_minGoal,
            idealGoal: this.state.addProject_idealGoal,
        });
    }
    editProject(){
        //TODO: when the user clicks the edit button, it needs to fill in the details for that project...
        
        var newName = this.state.editProject_name;
        var originalName = this.state.editProject_originalName;
        var minGoal = this.state.editProject_minGoal;
        var idealGoal = this.state.editProject_idealGoal;
        this.state.editProjectCallback({newName, originalName, minGoal, idealGoal});
    }
    deleteProject(){
        var deleteProjectData = {};
        deleteProjectData.targetName = this.state.editProject_name;
        this.state.deleteProjectCallback(deleteProjectData);
    }

    /*changeSelectedStudySessionProject(projectTitle){
        this.setState({studySession_selectedProject: projectTitle});
    }*/

    startStudySession(){
        console.log("hours: " + this.state.studySession_hours + ", minutes: " + this.state.studySession_minutes);
        var studySessionData = {
            timerDirection: 'down',
            timerRunning: true,
            timerTitle: this.state.studySession_selectedProject,
            timerTime: this.state.studySession_hours * 3600 + this.state.studySession_minutes * 60,
        };
        this.state.startStudySession(studySessionData);
    }
    

    render(){
        return(
            <div>





            </div>
        );
    }
}

export default ProjectModals;