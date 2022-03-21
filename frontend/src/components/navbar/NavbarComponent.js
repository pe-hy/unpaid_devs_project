import Navbar from "react-bootstrap/Navbar";
import { Container, Nav } from "react-bootstrap";
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Logo from "../../resources/OUbile.png";
import "./NavbarStyles.css";
import { BsFillHouseFill, BsFillPersonFill } from "react-icons/bs";
import LoginControlComponent from "../logincontrol/LoginControlComponent";

let iconStyles = { fontSize: "2.5em" };

function refreshPage() {
  window.location.reload();
}

const NavbarComponent = () => {
  return (
    <div className={"navbar-main"}>
      <Navbar collapseOnSelect expand="lg" variant="light">
        <Container fluid>
          <Navbar.Brand href="#">
            <img
              onClick={refreshPage}
              width="90px"
              height="90px"
              className="img-responsive"
              src={Logo}
              alt="logo"
            />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link className="ms-md-5">
                <span onClick={refreshPage} id="prehled">
                  <BsFillHouseFill style={iconStyles} />
                  <p className={"p-margin"}>Home</p>
                </span>
              </Nav.Link>
              <Nav.Link className="ms-md-5">
                <span id="prehled">
                  <BsFillPersonFill style={iconStyles} />
                  <p className={"p-margin"}>Účet</p>
                </span>
              </Nav.Link>
            </Nav>
            <Nav>
              <Nav eventkey={2} className="navbar-text white">
                <LoginControlComponent />
              </Nav>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
};

export default NavbarComponent;
