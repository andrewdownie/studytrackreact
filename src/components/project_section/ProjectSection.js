import ProjectButtonsWrapper from './ProjectButtonsWrapper';
import ProjectModals from './ProjectModals';
import ProjectList from './ProjectList';
import {Row} from 'react-bootstrap';
import React from 'react';
import SheetUtil from '../../utils/SheetUtil';
import DateUtil from '../../utils/DateUtil';



const ProjectSection = (props) => {
    var noProjectsFound;

    if(props.projectNames){
        noProjectsFound = props.projectNames.length == 0 && props.loadedFromRemote;
    }
    else{
        noProjectsFound = true;
    }


    return(
        <div className="show-grid project-section">
            <ProjectButtonsWrapper
                openAddProjectModalCallback={props.openAddProjectModalCallback}
                highlightAddProjectButton={noProjectsFound}
                openStudySessionModalCallback={props.openStudySessionModalCallback}
            />
            <ProjectList
                projectNames={props.projectNames}
                noProjectsFound={props.noProjectsFound}
                loadedFromRemote={props.loadedFromRemote}
                openEditProjectModalCallback={props.openEditProjectModalCallback}
            />
            <ProjectModals
                showEditProject={props.showEditProject}
                showAddProject={props.showAddProject}
                showLoadingModal={props.showLoadingModal}
                showStudyModal={props.showStudyModal}
                loadingModalMessage={props.loadingModalMessage}
                addProjectCallback={props.addProjectCallback}
                editProjectCallback={props.editProjectCallback}
                deleteProjectCallback={props.deleteProjectCallback}
                editProject_name={props.editProject_name}
                editProject_minGoal={props.editProject_minGoal}
                editProject_idealGoal={props.editProject_idealGoal}
                projectNames={props.projectNames}
            />
        </div>
    );
}

export default ProjectSection;