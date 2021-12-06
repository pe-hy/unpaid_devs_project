import LoginFormComponent from "../../components/loginForm/LoginFormComponent";
import {Container} from "react-bootstrap";

const LoginView = () => {
    return (
        <Container className = "justify-content-start" styles={{width: "50%"}}>
            <LoginFormComponent/>
        </Container>
    );
};

export default LoginView;
