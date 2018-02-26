
import {Button, ButtonGroup} from 'react-bootstrap';
import React, { Component } from 'react';

import FaPlus from 'react-icons/lib/fa/plus';
import MdSchedule from 'react-icons/lib/md/schedule';


class ProjectButtonsWrapper extends Component{
    render(){
        return(
            <ButtonGroup vertical block>
                <Button className="btn-spacing-sm" bsStyle="primary"><MdSchedule/> Start Study Session</Button>
                <Button className="btn-spacing-sm" bsStyle="success"><FaPlus/> New Project</Button>
            </ButtonGroup>
        );
    }
}

export default ProjectButtonsWrapper;