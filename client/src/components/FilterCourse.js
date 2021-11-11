import React, { Component } from "react";
import { storage, datab, auth} from "../services/firebase";

export default class FilterCourse extends Component {
  render() {
    const onChangeQualification = this.props.onChange;
    const qualification = this.props.qualification;
    return (
         <div>
          <label for="qualification">Qualification</label>
          <select id ="qualification" value={qualification} onChange={onChangeQualification}>
          <option value="All">All</option>
          <option value="Level 5: PLC">Level 5: PLC</option>
          <option value="Level 6: Advanced Certificate">Level 6: Advanced Certificate</option>
          <option value="Level 7: Ordinary Bachelor Degree">Level 7: Ordinary Bachelor Degree</option>
          <option value="Level 8: Honours Bachelor Degree">Level 8: Honours Bachelor Degree</option>
          <option value="Level 8: Higher Diploma">Level 8: Higher Diploma</option>
          <option value="Level 9: Masters Degree">Level 9: Masters Degree</option>
          <option value="Level 9: Post-Graduate Diploma">Level 9: Post-Graduate Diploma</option>
          <option value="Level 10: Doctoral Degree">Level 10: Doctoral Degree</option>
          <option value="Level 10: Higher Doctorate">Level 10: Higher Doctorate</option>
        </select>
      </div>
    );
  }
}