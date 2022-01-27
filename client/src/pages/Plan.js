import React from "react";
import Planner from "../components/Planner";
import Header from "../components/Header";
import { datab, auth} from "../services/firebase";

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: auth().currentUser,
    };
  }

  render() {
    return (
      <div>
        <Header />
        <Planner/>
      </div>
    );
  }
}
export default Profile;