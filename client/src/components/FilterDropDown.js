import React, { Component } from "react";

export const FilterCareer = (props) => {
    return (
         <div>
          <label htmlFor="industry">Industry</label>
          <select id ="industry" name={props.name} value={props.industry} onChange={props.onChange}>
          <option value="">{props.nothingSelected}</option>
          <option value="IT Jobs">IT Jobs</option>
          <option value="Logistics and Warehouse Jobs">Logistics and Warehouse Jobs</option>
          <option value="Hospitality and Catering Jobs">Hospitality and Catering Jobs</option>
          <option value="Accounting and Finance Jobs">Accounting and Finance Jobs</option>
          <option value="Sales Jobs">Sales Jobs</option>
          <option value="Engineering Jobs">Engineering Jobs</option>
          <option value="Healthcare and Nursing Jobs">Healthcare and Nursing Jobs</option>
          <option value="Teaching Jobs">Teaching Jobs</option>
          <option value="Trade and Construction Jobs">Trade and Construction Jobs</option>
          <option value="Social work Jobs">Social work Jobs</option>
          <option value="Arts and Media Jobs">Arts and Media</option>
          <option value="Admin and Clerical Jobs">Arts and Media</option>
          <option value="Other">Other</option>
        </select>
      </div>
    );
  }
export const FilterCourse = (props) => {
    return (
         <div>
          <label htmlFor="qualification">Qualification</label>
          <select id ="qualification" name={props.name} value={props.qualification} onChange={props.onChange}>
          <option value="">{props.nothingSelected}</option>
          <option value="Level 5: PLC">Level 5: PLC</option>
          <option value="Level 6: Advanced Certificate">Level 6: Advanced Certificate</option>
          <option value="Level 7: Ordinary Bachelor Degree">Level 7: Ordinary Bachelor Degree</option>
          <option value="Level 8: Honours Bachelor Degree">Level 8: Honours Bachelor Degree</option>
          <option value="Level 8: Higher Diploma">Level 8: Higher Diploma</option>
          <option value="Level 9: Masters Degree">Level 9: Masters Degree</option>
          <option value="Level 9: Post-Graduate Diploma">Level 9: Post-Graduate Diploma</option>
          <option value="Level 10: Doctoral Degree">Level 10: Doctoral Degree</option>
          <option value="Level 10: Higher Doctorate">Level 10: Higher Doctorate</option>
          <option value="Other: Certificate">Other: Certificate</option>
        </select>
      </div>
    );
  }