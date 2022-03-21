import LoginComponent from "../../components/loginForm/LoginComponent";
import { Container } from "react-bootstrap";
import NavbarComponent from "../../components/navbar/NavbarComponent";

const LoginView = () => {
  return (
    <Container className={"login-main"}>
      <LoginComponent />
    </Container>
  );
};

export default LoginView;
