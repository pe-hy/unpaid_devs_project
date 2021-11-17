import React from "react";
import { BsPower, BsPlusLg, BsPersonCheckFill } from "react-icons/bs";
import { Row, Col, Container } from "react-bootstrap";

let iconStyles = { fontSize: "1.5em" };

function LoginButton(props) {
  return (
    <Container fluid>
      <div onClick={props.onClick}>
        <BsPersonCheckFill style={iconStyles} /> Přihlásit se
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
            <BsPlusLg style={iconStyles} /> Registrovat se
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
        <BsPower style={iconStyles} /> Odhlásit se
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
    if (!isRegistered) {
      button = <RegisterButton onClick={this.handleRegisterClick} />;
    } else if (isLoggedIn) {
      button = <LogoutButton onClick={this.handleLogoutClick} />;
    } else {
      button = <LoginButton onClick={this.handleLoginClick} />;
    }

    return (
      <div>
        {isRegistered}
        {isLoggedIn}
        {button}
      </div>
    );
  }
}
export default LoginControl;
