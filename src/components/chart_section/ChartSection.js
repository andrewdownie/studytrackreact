import React, {Component} from 'react';
import {Row, Col} from 'react-bootstrap';
import StudyChart from './StudyChart';
import FaSpinner from 'react-icons/lib/fa/spinner';


class ChartSection extends Component {
    render(){
        /* Why is the data element of each chart in the chart list have a length of 0? */
        if(this.props.chartList.length === 0){
            /* How do I animate this? */
            return(
                <p><FaSpinner className="spin"/> Loading chart data...</p>
            );
        }

        return(
            <Row className="show-grid">
                {
                    /* None of this gets added to the page... */
                    this.props.chartList.map( (chart, i) => {
                        return (
                            <Col key={"chartcol" + i} sm={this.props.chartColSize} >
                                <h2 className="chart-header">{chart.title}</h2>
                                <StudyChart graph_id={"chart" + i} studyData={chart.data} />
                            </Col>
                        )
                    })
                }
            </Row>
        );
    }
}

export default ChartSection;