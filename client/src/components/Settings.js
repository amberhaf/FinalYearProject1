import React, { Component } from "react";
import Button from 'react-bootstrap/Button';
import { Link } from "react-router-dom";
export default class Settings extends Component {

//settings page
  render() {
    return (
      <div>
        <div className="center">
          <h1 className="text-center">
            Settings
          </h1>
        {/*Link to change password*/}
        <Link to = "/Forgot"><Button  className = "forgotButton darkFont" variant="warning" size="lg" block>
          Change Password
        </Button></Link>
        {/*Link to delete account*/}
        <Link to = "/DeleteAccount"><Button  className = "deleteButton" variant="danger" size="lg" block>
          Delete Account
        </Button></Link>
        </div>
      </div>
    );
  }
}
