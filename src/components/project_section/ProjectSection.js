import React, { Component } from 'react';
import ProjectButtonsWrapper from './ProjectButtonsWrapper';
import ProjectList from './ProjectList';
import {Row} from 'react-bootstrap';



class ProjectSection extends Component{
    render(){
        return(
            //TODO: should the title for the component go here? ...I'm thinking not, but this is something I'll come back to...
            <Row className="show-grid project-row">
                <ProjectButtonsWrapper />
                <ProjectList />
            </Row>
        );
    }
}

export default ProjectSection;