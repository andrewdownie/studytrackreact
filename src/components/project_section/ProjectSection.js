import ProjectButtonsWrapper from './ProjectButtonsWrapper';
import ProjectList from './ProjectList';
import {Row} from 'react-bootstrap';
import React from 'react';



const ProjectSection = (props) => {
    return(
        <Row className="show-grid project-row">
            <ProjectButtonsWrapper />
            <ProjectList projectNames={props.projectNames} />
        </Row>
    );
}

export default ProjectSection;