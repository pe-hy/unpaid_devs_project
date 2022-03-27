import React from "react";
import {
  BsPower,
  BsPlusLg,
  BsPersonCheckFill,
  BsPersonCircle,
} from "react-icons/bs";
import { Row, Col, Container, Nav } from "react-bootstrap";
import "./LoginControlStyles.css";
import LoginInformationComponent from "../loginInformation/LoginInformationComponent";
import { userContext } from "../../userContext";
import AuthService from "../../services/AuthService";
let iconStyles = { fontSize: "1.5em", color: "white" };
let textStyles = { color: "white" };

function showUserPhoto() {
  return (
    <span>
      <BsPersonCircle style={iconStyles} />
    </span>
  );
}

function LoginButton(props) {
  return (
    <Container fluid>
      <div onClick={props.onClick}>
        <BsPersonCheckFill style={iconStyles} />{" "}
        <span style={textStyles}>Přihlásit se</span>
      </div>
    </Container>
  );
}

function RegisterButton(props) {
  return (
    <Container fluid>
      <Col>
        <Row>
          <div onClick={props.onClick}>
            <BsPlusLg style={iconStyles} />{" "}
            <span style={textStyles}>Registrovat se</span>
          </div>
        </Row>
      </Col>
    </Container>
  );
}

function LogoutButton(props) {
  return (
    <Container fluid>
      <div onClick={props.onClick}>
        <BsPower style={iconStyles} />{" "}
        <span style={textStyles}>Odhlásit se</span>
      </div>
    </Container>
  );
}

class LoginControl extends React.Component {
  static contextType = userContext;
  constructor(props) {
    super(props);
    this.handleLoginClick = this.handleLoginClick.bind(this);
    this.handleLogoutClick = this.handleLogoutClick.bind(this);
    this.handleRegisterClick = this.handleRegisterClick.bind(this);
    this.state = { isLoggedIn: false };
    this.state = { isRegistered: true };
  }

  setCorrectButton() {
    if (localStorage.getItem("role") == null) {
      this.setState({ isLoggedIn: false });
    } else {
      this.setState({ isLoggedIn: true });
    }
    this.setState({ isRegistered: true });
  }

  handleLoginClick() {
    window.location.href = "/login";
  }

  handleLogoutClick() {
    AuthService.logout().then(
      (res) => {
        console.log(res)
      });
    localStorage.clear();
    this.context.logOut();
    window.location.href = "/";
  }

  handleRegisterClick() {
    this.setState({ isRegistered: true });
    //window.location.href = '/registration'; ještě není implementováno
  }

  componentDidMount() {
    window.addEventListener("load", this.setCorrectButton.bind(this));
  }

  render() {
    const isLoggedIn = this.context.loggedIn.loggedIn;
    const isRegistered = this.state.isRegistered;
    let button;
    let userPhoto;
    if (!isRegistered) {
      button = <RegisterButton onClick={this.handleRegisterClick} />;
    } else if (isLoggedIn) {
      button = <LogoutButton onClick={this.handleLogoutClick} />;
      userPhoto = showUserPhoto();
    } else {
      button = <LoginButton onClick={this.handleLoginClick} />;
    }
    if (isLoggedIn) {
      return (
        <div>
          <ul className="nav" style={{ marginRight: "60px" }}>
            <li className="nav-item d-flex align-items-center">
              <Nav.Link id="button">{button}</Nav.Link>
            </li>
            <li className="nav-item" style={{ width: "fit-content" }}>
              <div
                style={{
                  height: "170px",
                  width: "170px",
                  padding: "50px",
                  fontSize: "2.5em",
                }}
              >
                {userPhoto}
              </div>
            </li>
            <li
              className="nav-item align-items-center d-flex"
              style={textStyles}
            >
              <LoginInformationComponent
                isLoggedIn={this.context.loggedIn.loggedIn}
              />
            </li>
          </ul>
        </div>
      );
    } else {
      return (
        <div style={{ marginRight: "30px" }}>
          <Nav.Link id={"button"}>{button}</Nav.Link>
        </div>
      );
    }
  }
}
export default LoginControl;
