import LoginComponent from "../../components/loginForm/LoginComponent";
import {Container} from "react-bootstrap";

const LoginView = () => {
    return (
        <Container className = "justify-content-start" styles={{width: "50%"}}>
            <LoginComponent/>
        </Container>
    );
};

export default LoginView;
