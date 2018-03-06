import React, {Component} from 'react';
import {Row, Col, Button, Table} from 'react-bootstrap';

import FaPlayCircle from 'react-icons/lib/fa/play-circle';
import FaSpinner from 'react-icons/lib/fa/spinner';
import FaEdit from 'react-icons/lib/fa/edit';


const ProjectList = (props) => {
    if(props.projectNames === null){
        //TODO: where do I check if this week has been setup yet?
    }

    if(props.projectNames.length === 0){
        return(
            <p><FaSpinner className="spin"/> Loading project list...</p>
        );
    }
    
    return(
        <div className="project-list">
            {
                props.projectNames.map( (projectName, i) => {
                    return (
                        <div className="project-row" key={"chartcol" + i}>
                            <Button className="btn-responsive start-project-timer-btn" bsStyle="link"><FaPlayCircle/> {projectName}</Button>
                            <Button className="edit-project-btn" bsSize="sm" bsStyle="primary"><FaEdit/></Button>
                        </div>
                    )
                })
            }

        </div>
    );

}

export default ProjectList;