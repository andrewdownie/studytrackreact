import ProjectButtonsWrapper from './ProjectButtonsWrapper';
import ProjectModals from './ProjectModals';
import ProjectList from './ProjectList';
import {Row} from 'react-bootstrap';
import React from 'react';



const ProjectSection = (props) => {
    var noProjectsFound = props.projectNames.length == 0 && props.loadedFromRemote;


    console.log(props.showEditProject);

    return(
        <div className="show-grid project-section">
            <ProjectButtonsWrapper
                openAddProjectModalCallback={props.openAddProjectModalCallback}
                highlightAddProjectButton={noProjectsFound}
            />
            <ProjectList
                projectNames={props.projectNames}
                loadedFromRemote={props.loadedFromRemote}
                openEditProjectModalCallback={props.openEditProjectModalCallback}
            />
            <ProjectModals
                showEditProject={props.showEditProject}
                showAddProject={props.showAddProject}
                addProjectCallback={props.addProjectCallback}
                editProjectCallback={props.editProjectCallback}
                deleteProjectCallback={props.deleteProjectCallback}
            />
        </div>
    );
}

export default ProjectSection;