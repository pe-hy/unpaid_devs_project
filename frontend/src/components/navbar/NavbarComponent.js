import Navbar from 'react-bootstrap/Navbar'
import React from 'react';
import {Container, Nav, NavDropdown} from "react-bootstrap";
import Logo from "../../resources/logo.png";
import "./NavbarStyles.css"

const user = "Nepřihláśený uźivatel"

class NavbarComponent extends React.Component {
    render() {
        return (
            <div>
                <Navbar collapseOnSelect expand="lg" bg="light" variant="light">
                    <Container>
                        <Navbar.Brand href="#home"><img width="150px" height="auto" className="img-responsive" src={Logo}  alt="logo" /></Navbar.Brand>
                        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                        <Navbar.Collapse id="responsive-navbar-nav">
                            <Nav className="me-auto">
                            </Nav>
                            <Nav className="me-auto">
                                <h3> Registrace studentů na praxe </h3>
                            </Nav>
                            <Nav>
                                <span className="navbar-text" >
                                     Nepřihlášený uživatel
                                </span>
                                <Nav.Link eventKey={2} href="#registrace">
                                    Registrace
                                </Nav.Link>
                            </Nav>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
            </div>
        );
    }
}

export default NavbarComponent