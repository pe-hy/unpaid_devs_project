import { Container } from "react-bootstrap";
import LoginComponent from "../../components/UnspecifiedRoles/login/loginForm/LoginComponent";

const LoginView = () => {

  return (
    <Container className={"login-main"}>
      <LoginComponent update={this.props.stateShouldUpdate}/>
    </Container>
  );
};

export default LoginView;
