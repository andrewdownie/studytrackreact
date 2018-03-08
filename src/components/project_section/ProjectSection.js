import ProjectButtonsWrapper from './ProjectButtonsWrapper';
import ProjectModals from './ProjectModals';
import ProjectList from './ProjectList';
import {Row} from 'react-bootstrap';
import React from 'react';



const ProjectSection = (props) => {
    var noProjectsFound = props.projectNames.length == 0 && props.loadedFromRemote;


    console.log(props.showAddProject);

    return(
        <div className="show-grid project-section">
            <ProjectButtonsWrapper openAddProjectModalCallback={props.openAddProjectModalCallback} highlightAddProjectButton={noProjectsFound} />
            <ProjectList projectNames={props.projectNames} loadedFromRemote={props.loadedFromRemote} />
            <ProjectModals showEditProject={props.showEditProject} showAddProject={props.showAddProject} addProjectCallback={props.addProjectCallback} />
        </div>
    );
}

export default ProjectSection;