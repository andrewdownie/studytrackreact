import ProjectButtonsWrapper from './ProjectButtonsWrapper';
import ProjectList from './ProjectList';
import {Row} from 'react-bootstrap';
import React from 'react';



const ProjectSection = (props) => {
    return(
        <div className="show-grid project-section">
            <ProjectButtonsWrapper />
            <ProjectList projectNames={props.projectNames} />
        </div>
    );
}

export default ProjectSection;