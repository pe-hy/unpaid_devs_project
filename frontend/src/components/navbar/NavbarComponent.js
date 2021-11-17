import Navbar from 'react-bootstrap/Navbar'
import {Container, Nav} from "react-bootstrap";
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Logo from "../../resources/logo.png";
import "./NavbarStyles.css"
import { BsFillHouseFill, BsPersonCircle } from "react-icons/bs";
import LoginControlComponent from "../logincontrol/LoginControlComponent";

let iconStyles = { fontSize: "2em" };

class NavbarComponent extends React.Component {
    render() {
        return (
            <div>
                <Navbar collapseOnSelect expand="lg" bg="light" variant="light">
                    <Container fluid>
                        <Navbar.Brand href="#home"><img width="150px" height="auto" className="img-responsive" src={Logo}  alt="logo" /></Navbar.Brand>
                        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                        <Navbar.Collapse id="responsive-navbar-nav">
                            <Nav className="me-auto">
                                <Nav.Link className="ms-md-5">
                                    <BsFillHouseFill style={iconStyles}/>
                                </Nav.Link>
                                <Nav.Link className="ms-md-5">
                                    <BsPersonCircle style={iconStyles}/>
                                </Nav.Link>
                            </Nav>
                            <Nav className="me-auto">
                                <h3>Registrace studentů na praxe</h3>
                            </Nav>
                            <Nav>
                                <Nav.Link eventKey={2} className="navbar-text">
                                    <LoginControlComponent/>
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