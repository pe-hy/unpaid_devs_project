import RegisterComponent, {RegistrationComponent} from "../../components/registration/RegistrationComponent.js";
import { Container } from "react-bootstrap";
import NavbarComponent from "../../components/navbar/NavbarComponent";
import "./RegisterView.css"

const RegisterView = () => {
  return (
    <Container className="registration-view-container">
      <RegistrationComponent />
    </Container>
  );
};

export default RegisterView;
