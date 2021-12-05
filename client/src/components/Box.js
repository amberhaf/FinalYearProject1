import React, { useRef, Component } from 'react';
import JobSearch from './JobSearch';
import InstitionWebsite from './InstitutionWebsite';

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
          <InstitionWebsite search={props.box.instituteName} />
        </ul>
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
          <JobSearch search={props.box.jobTitle} />
        </ul>
      </div>
    );
  };