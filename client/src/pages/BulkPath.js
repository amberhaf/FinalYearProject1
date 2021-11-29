import React from "react";
import BulkMap from "../components/BulkMap";
import Header from "../components/Header";
import { storage, datab, auth} from "../services/firebase";

class BulkPath extends React.Component {
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
        <BulkMap/>
      </div>
    );
  }
}
export default BulkPath;