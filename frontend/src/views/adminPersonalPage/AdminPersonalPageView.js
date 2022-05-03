import "./AdminPersonalPageStyles.css";
import CoordinatorPersonalPageComponent from "../../components/CoordinatorRole/CoordinatorPersonalPage/CoordinatorPersonalPageComponent.js";
import {Navigate} from "react-router-dom";

const checkRole = () => {
  console.log("storage",localStorage.getItem("role"));
  return localStorage.getItem("role") !== "ROLE_ADMIN";
};

const AdminPersonalPageView = () => {
  if (checkRole()) return <Navigate to="/login" />;
  return (
    <div className="container">
        <div className="cstmpadd">
            <CoordinatorPersonalPageComponent/>
        </div>
    </div>
  );
};

export default AdminPersonalPageView;
