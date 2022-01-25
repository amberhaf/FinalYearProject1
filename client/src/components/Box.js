import React, { useRef, Component } from 'react';

function reducer (previousValue, currentValue) {return parseInt(previousValue) + parseInt(currentValue);}

export const EduBox = (props) => {
    return (
      <div id={props.box.id} className="boxStyle edu">
        <ul>
          <li><b>Institute Name:</b></li>
          <li>{props.box.instituteName}</li>
          <li><b>Qualification:</b></li>
          <li>{props.box.qualification}</li>
          <li><b>Course Title:</b></li>
          <li>{props.box.courseTitle}</li>
          <li><b>Course Length:</b></li>
          <li>{props.box.courseLength/(props.box.numOfEntries||1)}</li>
          <li><b>Count:</b></li>
          <li>{props.box.numOfEntries}</li>
        </ul>
        {/* todo make boxes connect at different points */}
      </div>
    );
  };
export const CarBox = (props) => {
    return (
      <div id={props.box.id} className="boxStyle car">
        <ul>
          <li><b>Company Name:</b></li>
          <li>{props.box.companyName}</li>
          <li><b>Industry:</b></li>
          <li>{props.box.industry}</li>
          <li><b>Job Title:</b></li>
          <li>{props.box.jobTitle}</li>
          <li><b>Job length:</b></li>
          <li>{props.box.jobLength/(props.box.numOfEntries||1)}</li>
          <li><b>Count:</b></li>
          <li>{props.box.numOfEntries}</li>
        </ul>
      </div>
    );
  };