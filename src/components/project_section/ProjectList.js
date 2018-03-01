import React, {Component} from 'react';
import {Row, Col, Button, Table} from 'react-bootstrap';

import FaEdit from 'react-icons/lib/fa/edit';
import FaPlayCircle from 'react-icons/lib/fa/play-circle';
import FaSpinner from 'react-icons/lib/fa/spinner';


class ProjectList extends Component{

    render(){
        if(this.props.projectNames.length === 0){
            return(
                <p><FaSpinner className="spin"/>Loading project list...</p>
            );
        }
        
        return(
            <Row className="show-grid project-list">
                <Col xs={12} >

                    <Table className="project-table" hover>
                    {/*TODO: this will be generated at runtime (at some point) which means I'll need child components to go here.*/}
                        <tbody>
                            {
                                this.props.projectNames.map( (projectName, i) => {
                                    return (
                                        <tr key={"chartcol" + i}>
                                            <td><Button className="btn-responsive" bsStyle="link"><FaPlayCircle/> {projectName}</Button></td>
                                            <td className="edit-btn-width"><Button className="edit-project-btn" bsSize="small" bsStyle="primary"><FaEdit/></Button></td>
                                        </tr>
                                    )
                                })
                            }

                        </tbody>
                    </Table>
                </Col>
            </Row>
        );
    }

}

export default ProjectList;