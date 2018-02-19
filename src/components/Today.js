import React from 'react';

const Today= (props) => {
    var todayTest = "";

    if(props.todaysData != null){
        todayTest = props.todaysData.projects[1].title;
    }
    
    return(
        <div>
            <h2>This is Today.js</h2>
            <p>Todays data next:</p>
            <p>{todayTest}</p>
        </div>
    );
};

export default Today;