import React from "react";
import { Link } from "react-router-dom";
import { auth } from "../services/firebase";
import { Navbar, Nav, Container} from 'react-bootstrap'

class Header extends React.Component {

  render() {
    return (
      <div>
        <Navbar className="navbarColour" variant="dark" expand="lg" sticky="top">
          <Container>
            <Navbar.Brand href="/">Path map</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse className="navbar" id="basic-navbar-nav">
            {auth().currentUser && (
          <Nav className="me-auto">
            <Nav.Link href="/plan">Planner</Nav.Link>
            <Nav.Link href="/inputPath">Input Path</Nav.Link>
            <Nav.Link href="/bulkPath">Bulk Path</Nav.Link>
          </Nav>
          )}
            <Nav>
            </Nav>
            {/*Page links*/}
            {auth().currentUser ? (
            <Nav className="mr-sm-2 navbar">
              <Nav.Link href="/account">Account</Nav.Link>
              <Nav.Link onClick={() => auth().signOut()} >Logout</Nav.Link>
            </Nav>
            ) : (
            <Nav className="mr-sm-2 navbar">
              <Nav.Link href="/login">Sign In</Nav.Link>
              <Nav.Link href="/signup">Sign Up</Nav.Link>
            </Nav>
            )}
          </Navbar.Collapse>
          </Container>
        </Navbar>
      </div>
    )
  }
}

export default Header;
