import React, { Component } from "react";
import Header from "../components/Header";
import { Link } from "react-router-dom";
import Map from "../components/Map";
export default class PathMap extends Component {
  render() {
    return (
      <div>
        <Header />
        <Map/>
        </div>
    );
  }
}
