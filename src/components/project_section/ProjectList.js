import React from 'react';
import {Button} from 'react-bootstrap';

import FaPlayCircle from 'react-icons/lib/fa/play-circle';
import FaEdit from 'react-icons/lib/fa/edit';


const ProjectList = (props) => {
    if(props.projectNames == null || props.projectNames.length === 0 ){
        return(
            <div className="project-list">
                <p className="text-center">You don't have any projects yet</p>
            </div>
        );
    }

    return(
        <div className="project-list">
            {
                props.projectNames.map( (projectName, i) => {
                    return (
                        <div className="project-row" key={"chartcol" + i}>
                            <Button onClick={props.callbacks.quickStartStudy.bind(this,projectName)} className="btn-responsive start-project-timer-btn" bsStyle="link"><FaPlayCircle/> {projectName}</Button>
                            <Button projectname={projectName} onClick={props.callbacks.openEditModal.bind(this, projectName)} className="edit-project-btn" bsSize="sm" bsStyle="primary"><FaEdit/></Button>
                        </div>
                    )
                })
            }

        </div>
    );

}

export default ProjectList;