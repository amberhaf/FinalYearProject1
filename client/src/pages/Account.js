import React from "react";
import Header from "../components/Header";
import MyDetails from "../components/MyDetails";
import Settings from "../components/Settings";
import { datab, auth } from "../services/firebase";

class Account extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: auth().currentUser
    }
  }

  render() {
    return (
      <div>
        <Header />
        <Settings />
        <MyDetails />
      </div>
    );
  }
}
export default Account;