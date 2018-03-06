import ProjectButtonsWrapper from './ProjectButtonsWrapper';
import ProjectModals from './ProjectModals';
import ProjectList from './ProjectList';
import {Row} from 'react-bootstrap';
import React from 'react';



const ProjectSection = (props) => {
    var noProjectsFound = props.projectNames.length == 0 && props.loadedFromRemote;

    return(
        <div className="show-grid project-section">
            <ProjectButtonsWrapper highlightAddProjectButton={noProjectsFound} />
            <ProjectList projectNames={props.projectNames} loadedFromRemote={props.loadedFromRemote} />
            <ProjectModals addProject={props.addProject} />
        </div>
    );
}

export default ProjectSection;