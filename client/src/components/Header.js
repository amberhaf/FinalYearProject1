import React from "react";
import { Link } from "react-router-dom";
import { auth } from "../services/firebase";
import { Navbar, Nav } from 'react-bootstrap'

class Header extends React.Component {

  render() {
    return (
      <div>
        {/*Makes use of react-bootstrap so that it is both responsive on mobile and desktop*/}
        <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
          <Navbar.Brand href="/">
            <Nav.Link className="navbar-brand" href="/">Path map</Nav.Link>
          </Navbar.Brand>
            {auth().currentUser && (
          <Navbar.Brand>
            <Nav.Link className="navbar-brand" href="/profile">Profile</Nav.Link>
            <Nav.Link className="navbar-brand" href="/inputPath">Input Career Path</Nav.Link>
          </Navbar.Brand>
            )}
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse className="navbar" id="basic-navbar-nav">
            <Nav>
            </Nav>
            {/*Page links*/}
            {auth().currentUser ? (
            <Nav className="mr-sm-2 navbar">
              <Nav.Link href="/account">Settings</Nav.Link>
              <Nav.Link onClick={() => auth().signOut()} >Logout</Nav.Link>
            </Nav>
            ) : (
            <Nav className="mr-sm-2 navbar">
              <Nav.Link href="/login">Sign In</Nav.Link>
              <Nav.Link href="/signup">Sign Up</Nav.Link>
            </Nav>
            )}
          </Navbar.Collapse>
        </Navbar>
      </div>
    )
  }
}

export default Header;
