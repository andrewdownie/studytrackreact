import React, {Component} from 'react';
import {Row, Col, Button, Table} from 'react-bootstrap';

import FaPlayCircle from 'react-icons/lib/fa/play-circle';
import FaSpinner from 'react-icons/lib/fa/spinner';
import FaEdit from 'react-icons/lib/fa/edit';


const ProjectList = (props) => {

    if(props.projectNames.length === 0 ){
        if(props.loadedFromRemote === false){
            return(
                <div className="project-list">
                    <p className="text-center"><FaSpinner className="spin"/> Loading project list</p>
                </div>
            );
        }
        else{
            return(
                <div className="project-list">
                    <p className="text-center">You don't have any projects yet</p>
                </div>
            );
        }
    }

    
    return(
        <div className="project-list">
            {
                props.projectNames.map( (projectName, i) => {
                    return (
                        <div className="project-row" key={"chartcol" + i}>
                            <Button className="btn-responsive start-project-timer-btn" bsStyle="link"><FaPlayCircle/> {projectName}</Button>
                            <Button projectname={projectName} onClick={props.openEditProjectModalCallback} className="edit-project-btn" bsSize="sm" bsStyle="primary"><FaEdit/></Button>
                        </div>
                    )
                })
            }

        </div>
    );

}

export default ProjectList;