import React, { Component} from 'react';
import {Row, Col, Button, Table} from 'react-bootstrap';

import FaEdit from 'react-icons/lib/fa/edit';
import FaPlayCircle from 'react-icons/lib/fa/play-circle';


class ProjectList extends Component {
    render(){
        return(
            <Col sm={9} >
                <Row className="show-grid">
                    <Col xs={12} >

                        <Table className="project-table" hover>
                        {/*TODO: this will be generated at runtime (at some point) which means I'll need child components to go here.*/}
                            <tbody>
                                <tr>
                                    <td><Button className="btn-responsive" bsStyle="link"><FaPlayCircle/> CTCI</Button></td>
                                    <td className="edit-btn-width"><Button className="edit-project-btn" bsSize="small" bsStyle="primary"><FaEdit/></Button></td>
                                </tr>
                                <tr>
                                    <td><Button className="btn-responsive" bsStyle="link"><FaPlayCircle/> Study Track React</Button></td>
                                    <td className="edit-btn-width"><Button className="edit-project-btn" bsSize="small" bsStyle="primary"><FaEdit/></Button></td>
                                </tr>
                                <tr>
                                    <td><Button className="btn-responsive" bsStyle="link"><FaPlayCircle/> Multiplayer AStar</Button></td>
                                    <td className="edit-btn-width"><Button className="edit-project-btn" bsSize="small" bsStyle="primary"><FaEdit/></Button></td>
                                </tr>
                                <tr>
                                    <td><Button className="btn-responsive" bsStyle="link"><FaPlayCircle/> Really really really really really really long name</Button></td>
                                    <td className="edit-btn-width"><Button className="edit-project-btn" bsSize="small" bsStyle="primary"><FaEdit/></Button></td>
                                </tr>
                                <tr>
                                    <td><Button className="btn-responsive" bsStyle="link"><FaPlayCircle/> SEAL PANGS</Button></td>
                                    <td className="edit-btn-width"><Button className="edit-project-btn" bsSize="small" bsStyle="primary"><FaEdit/></Button></td>
                                </tr>
                            </tbody>
                        </Table>
                    </Col>
                </Row>
            </Col>
        );
    }
}

export default ProjectList;