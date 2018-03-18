import ProjectButtonsWrapper from './ProjectButtonsWrapper';
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
                quickStartStudyCallback={props.quickStartStudyCallback}
            />
        </div>
    );
}

export default ProjectSection;