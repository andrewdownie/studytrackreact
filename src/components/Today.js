import React from 'react';

const Today= (props) => {
    console.log(props.todaysData);
    return(
        <div>
            <h2>This is Today.js</h2>
            <p>{props.todaysData}</p>
        </div>
    );
};

export default Today;