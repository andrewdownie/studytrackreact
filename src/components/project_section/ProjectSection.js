import ProjectButtonsWrapper from './ProjectButtonsWrapper';
import ProjectModals from './ProjectModals';
import ProjectList from './ProjectList';
import {Row} from 'react-bootstrap';
import React, {Component} from 'react';
import sheetdata_util from '../../pure_utils/sheetdata_util';
import date_util from '../../pure_utils/date_util';



class ProjectSection extends Component {
    constructor(props){
        super(props);


        this.state = {
            projectNames:sheetdata_util.ProjectNames(props.studyData, date_util.WeekOfYear()),
            addProjectCallback:props.addProjectCallback,
            openAddProjectModalCallback:props.openAddProjectModalCallback,
            editProjectCallback:props.editProjectCallback,
            openEditProjectModalCallback:props.openAddProjectModalCallback,
            deleteProjectCallback:props.deleteProjectCallback,
            loadedFromRemote:props.loadedFromRemote,
            showAddProject:props.showAddProject,
            showEditProject:props.showAddProject,
            editProject_name:props.editProject_name,
            editProject_minGoal:props.editProject_minGoal,
            editProject_idealGoal:props.editProject_idealGoal,
        }
    }

    componentWillReceiveProps(nextProps){
        console.log("project sec new props");
        console.log(nextProps.projectNames);
        console.log(nextProps.studyData);

        //TODO: nextProps.studyData has the correct value
        //TODO: ProjectNames returns the old value...
        var projectNames = sheetdata_util.ProjectNames(nextProps.studyData, date_util.WeekOfYear());
        console.log(projectNames);

        this.setState({
            projectNames:sheetdata_util.ProjectNames(nextProps.studyData, date_util.WeekOfYear()),
            addProjectCallback:nextProps.addProjectCallback,
            openAddProjectModalCallback:nextProps.openAddProjectModalCallback,
            editProjectCallback:nextProps.editProjectCallback,
            openEditProjectModalCallback:nextProps.openEditProjectModalCallback,
            deleteProjectCallback:nextProps.deleteProjectCallback,
            loadedFromRemote:nextProps.loadedFromRemote,
            showAddProject:nextProps.showAddProject,
            showEditProject:nextProps.showEditProject,
            editProject_name:nextProps.editProject_name,
            editProject_minGoal:nextProps.editProject_minGoal,
            editProject_idealGoal:nextProps.editProject_idealGoal,
        });
    }

    render(){
        var noProjectsFound;

        if(this.state.projectNames){
            noProjectsFound = this.state.projectNames.length == 0 && this.state.loadedFromRemote;
        }
        else{
            noProjectsFound = true;
        }


        return(
            <div className="show-grid project-section">
                <ProjectButtonsWrapper
                    openAddProjectModalCallback={this.state.openAddProjectModalCallback}
                    highlightAddProjectButton={noProjectsFound}
                />
                <ProjectList
                    projectNames={this.state.projectNames}
                    noProjectsFound={this.state.noProjectsFound}
                    loadedFromRemote={this.state.loadedFromRemote}
                    openEditProjectModalCallback={this.state.openEditProjectModalCallback}
                />
                <ProjectModals
                    showEditProject={this.state.showEditProject}
                    showAddProject={this.state.showAddProject}
                    addProjectCallback={this.state.addProjectCallback}
                    editProjectCallback={this.state.editProjectCallback}
                    deleteProjectCallback={this.state.deleteProjectCallback}
                    editProject_name={this.state.editProject_name}
                    editProject_minGoal={this.state.editProject_minGoal}
                    editProject_idealGoal={this.state.editProject_idealGoal}
                />
            </div>
        );
    }
}

export default ProjectSection;