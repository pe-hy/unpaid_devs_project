import { Container } from "react-bootstrap";
import { RegistrationComponent } from "../../components/registration/RegistrationComponent.js";
import "./RegisterView.css";

const RegisterView = () => {
  return (
    <Container className="registration-view-container">
      <RegistrationComponent />
    </Container>
  );
};

export default RegisterView;
