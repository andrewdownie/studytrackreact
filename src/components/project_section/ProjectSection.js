import ProjectButtonsWrapper from './ProjectButtonsWrapper';
import ProjectList from './ProjectList';
import {Row} from 'react-bootstrap';
import React from 'react';



const ProjectSection = () => {
    return(
        <Row className="show-grid project-row">
            <ProjectButtonsWrapper />
            <ProjectList />
        </Row>
    );
}

export default ProjectSection;