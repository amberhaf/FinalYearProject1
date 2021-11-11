import React, { Component } from "react";
import { storage, datab, auth} from "../services/firebase";

export default class FilterCareer extends Component {
  render() {
    const onChangeIndustry = this.props.onChange;
    const industryName = this.props.industryName;
    return (
         <div>
          <label for="industry">Industry</label>
          <select id ="industry" value={industryName} onChange={onChangeIndustry}>
          <option value="All">All</option>
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
        </select>
      </div>
    );
  }
}