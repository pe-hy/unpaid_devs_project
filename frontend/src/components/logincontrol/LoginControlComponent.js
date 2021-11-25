import React from "react";
import {BsPower, BsPlusLg, BsPersonCheckFill} from "react-icons/bs";
import {Row, Col, Container, Image, Nav} from "react-bootstrap";
import UserPicture from "../../resources/UserPhoto.svg";
import "./LoginControlStyles.css"
import LoginInformationComponent from "../loginInformation/LoginInformationComponent";
let iconStyles = { fontSize: "1.5em", color: "white"};
let textStyles = {color: "white"}

function showUserPhoto(){
  return (
          <Image style={{ height: "100%", width: "100%", backgroundSize: "contain", marginLeft: "-20px"}} src={UserPicture} roundedCircle />
  )
}

function LoginButton(props) {
  return (
    <Container fluid>
      <div onClick={props.onClick}>
        <BsPersonCheckFill style={iconStyles} /> <span style = {textStyles}>Přihlásit se</span>
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
            <BsPlusLg style={iconStyles} /> <span style = {textStyles}>Registrovat se</span>
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
        <BsPower style={iconStyles} /> <span style = {textStyles}>Odhlásit se</span>
      </div>
    </Container>
  );
}

class LoginControl extends React.Component {
  constructor(props) {
    super(props);
    this.handleLoginClick = this.handleLoginClick.bind(this);
    this.handleLogoutClick = this.handleLogoutClick.bind(this);
    this.handleRegisterClick = this.handleRegisterClick.bind(this);
    this.state = { isLoggedIn: false };
    this.state = { isRegistered: false };
  }

  handleLoginClick() {
    this.setState({ isLoggedIn: true });
  }

  handleLogoutClick() {
    this.setState({ isLoggedIn: false });
  }
  handleRegisterClick() {
    this.setState({ isRegistered: true });
  }

  render() {
    const isLoggedIn = this.state.isLoggedIn;
    const isRegistered = this.state.isRegistered;
    let button;
    let userPhoto;
    if (!isRegistered) {
      button = <RegisterButton onClick={this.handleRegisterClick} />;
    } else if (isLoggedIn) {
      button = <LogoutButton onClick={this.handleLogoutClick} />;
      userPhoto = showUserPhoto()
    } else {
      button = <LoginButton onClick={this.handleLoginClick} />;
    }
    if(isLoggedIn){
      return (
          <div>
            <ul className="nav" style={{marginRight: "60px"}}>
              <li className="nav-item d-flex align-items-center">
                <Nav.Link id="button">
                  {button}
                </Nav.Link>
              </li>
              <li className="nav-item" style={{width: "fit-content"}}>
                <div style={{height: "132px", width: "132px"}}>{userPhoto}</div>
              </li>
              <li className="nav-item align-items-center d-flex" style={textStyles}>
                <LoginInformationComponent isLoggedIn={this.state.isLoggedIn}/>
              </li>
            </ul>
          </div>
      );
    }else{
      return (
          <div style={{marginRight: "30px"}}>
                <Nav.Link id={"button"}>
                  {button}
                </Nav.Link>
          </div>
      );
    }
  }
}
export default LoginControl;
