import { Container } from "react-bootstrap";
import LoginComponent from "../../components/loginForm/LoginComponent";

const LoginView = () => {
  return (
    <Container className={"login-main"}>
      <LoginComponent />
    </Container>
  );
};

export default LoginView;
