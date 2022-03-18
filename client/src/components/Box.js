import React from 'react';

export const EduBox = (props) => {
  return (
    // renders education objects as boxes
    <div className="boxStyle edu">
      <div id={props.box.id+"_end"} className="end"></div>
      <ul>
        <li><b>Institute Name:</b></li>
        <li className="lightFont">{props.box.instituteName}</li>
        <li><b>Qualification:</b></li>
        <li className="lightFont">{props.box.qualification}</li>
        <li><b>Course Title:</b></li>
        <li className="lightFont">{props.box.courseTitle}</li>
        <li><b>Course Length:</b></li>
        {/* rounds and averages matching object lengths */}
        <li className="lightFont">{(Math.round((props.box.length / props.box.numOfEntries) * 100)) / 100 || 1} years</li>
      </ul>
    </div>
  );
};
export const CarBox = (props) => {
  return (
    // renders career objects as boxes
    <div className="boxStyle car">
      <div id={props.box.id+"_end"} className="end"></div>
      <ul>
        <li><b>Company Name:</b></li>
        <li className="lightFont">{props.box.companyName}</li>
        <li><b>Industry:</b></li>
        <li className="lightFont">{props.box.industry}</li>
        <li><b>Job Title:</b></li>
        <li className="lightFont">{props.box.jobTitle}</li>
        <li><b>Job length:</b></li>
        {/* rounds and averages matching object lengths */}
        <li className="lightFont">{(Math.round((props.box.length / props.box.numOfEntries) * 100)) / 100 || 1} years</li>
      </ul>
    </div>
  );
};