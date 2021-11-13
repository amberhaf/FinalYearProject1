import React, { Component } from "react";
import Header from "../components/Header";
import { Link } from "react-router-dom";
import Map from "../components/Map";
export default class PathMap extends Component {
  render() {
    return (
      <div>
        <Header />
        {/* Buttons to link to timetable page, Outfits page and resources page */}
        <section className="page-section bg-primary">
          <div className="container text-center">
              <h2 className="Head">Path Mapper</h2>
            <h5>Welcome to Path Mapper<br></br>
              Here you can view a web of other people career paths <br></br>
              Discover how to get to your dream job
            </h5>
          </div>
        </section>
        <Map/>
        </div>
    );
  }
}
