import RegisterComponent, {RegistrationComponent} from "../../components/registration/RegistrationComponent.js";
import { Container } from "react-bootstrap";
import NavbarComponent from "../../components/navbar/NavbarComponent";

const RegisterView = () => {
  return (
    <Container
      style={{
        marginTop: "250px",
        position: "relative",
        left: "50%",
        top: "33%",
        transform: "translate(-50%, -50%)",
      }}
    >
      <RegistrationComponent />
    </Container>
  );
};

export default RegisterView;
