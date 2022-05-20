import { Container } from "react-bootstrap";
import LoginComponent from "../../components/UnspecifiedRoles/login/loginForm/LoginComponent";
import { Navigate } from "react-router-dom";


const autoRedirectBasedOnRole = () => {
  let role = localStorage.getItem("role");
  if (window.location.href.indexOf("token") > -1) {
    return <Container className={"login-main"}>
      <LoginComponent />
    </Container>;
  }
  switch (role) {
    case "ROLE_STUDENT":
      return <Navigate to="/studentHome" />;
      break;
    case "ROLE_TEACHER":
      return <Navigate to="/teacherHome" />;
      break;
    case "ROLE_COORDINATOR":
      return <Navigate to="/coordinatorHome" />;
      break;
    case "ROLE_ADMIN":
      return <Navigate to="/adminHome" />;
      break;
    default:
      return <Container className={"login-main"}>
        <LoginComponent />
      </Container>;
  }
};

const LoginView = () => {

  return autoRedirectBasedOnRole();
};

export default LoginView;
