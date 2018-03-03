
import {Button, ButtonGroup} from 'react-bootstrap';
import React from 'react';

import MdSchedule from 'react-icons/lib/md/schedule';
import FaPlus from 'react-icons/lib/fa/plus';


const ProjectButtonsWrapper = () => {
    return(
        <ButtonGroup vertical block className="project-button-group">
            <Button className="btn-spacing-sm" bsStyle="primary"><MdSchedule/> Start Study Session</Button>
            <Button className="btn-spacing-sm" bsStyle="success"><FaPlus/> New Project</Button>
        </ButtonGroup>
    );
}

export default ProjectButtonsWrapper;