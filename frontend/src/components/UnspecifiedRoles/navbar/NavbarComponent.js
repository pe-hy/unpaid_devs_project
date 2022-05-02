import Navbar from "react-bootstrap/Navbar";
import {Container, Nav} from "react-bootstrap";
import React, {useEffect, useState} from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Logo from "../../../resources/OUbile.png";
import "./NavbarStyles.css";
import {BsFillHouseFill, BsFillPersonFill} from "react-icons/bs";
import LoginControlComponent from "../login/logincontrol/LoginControlComponent";

let iconStyles = {fontSize: "2.5em"};

function refreshPage() {
    window.location.reload();
}

const NavbarComponent = () => {

    const redirectBasedOnRoleMainView = () => {
        console.log("role", JSON.parse(localStorage.getItem("user")).role);
        switch (JSON.parse(localStorage.getItem("user")).role) {
            case 'ROLE_STUDENT':
                return window.location.href = '/studentHome';
            case "ROLE_TEACHER":
                return window.location.href = '/teacherHome';
            case 'ROLE_COORDINATOR':
                return window.location.href = '/coordinatorHome';
            case 'ROLE_ADMIN':
                return window.location.href = '/adminHome';
            default:
                console.log("fail");
                return window.location.href = '/login';
        }
    }

    const redirectBasedOnRolePersonalPage = () => {
        switch (JSON.parse(localStorage.getItem("user")).role) {
            case 'ROLE_STUDENT':
                return window.location.href = '/studentPersonal';
            case "ROLE_TEACHER":
                return window.location.href = '/teacherPersonal';
            case 'ROLE_COORDINATOR':
                return window.location.href = '/coordinatorPersonal';
            case 'ROLE_ADMIN':
                return window.location.href = '/adminPersonal';
            default:
                return window.location.href = '/login';
        }
    }
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
                    <Navbar.Toggle aria-controls="responsive-navbar-nav"/>
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link className="ms-md-5">
                                <span onClick={() => redirectBasedOnRoleMainView()} id="prehled">
                                  <BsFillHouseFill style={iconStyles}/>
                                  <p className={"p-margin"}>Home</p>
                                </span>
                            </Nav.Link>
                            <Nav.Link className="ms-md-5">
                                <span onClick={() => redirectBasedOnRolePersonalPage()} id="prehled">
                                  <BsFillPersonFill style={iconStyles}/>
                                  <p className={"p-margin"}>Účet</p>
                                </span>
                            </Nav.Link>
                        </Nav>
                        <Nav>
                            <Nav eventkey={2} className="navbar-text white">
                                <LoginControlComponent/>
                            </Nav>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </div>
    );
};

export default NavbarComponent;
