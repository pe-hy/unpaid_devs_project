import "./CoordinatorPersonalPageStyles.css";
import CoordinatorPersonalPageComponent from "../../components/CoordinatorRole/CoordinatorPersonalPage/CoordinatorPersonalPageComponent.js";
import {Navigate} from "react-router-dom";

const checkRole = () => {
  console.log("storage",localStorage.getItem("role"));
  return localStorage.getItem("role") !== "ROLE_COORDINATOR";
};

const CoordinatorPersonalPageView = () => {
  if (checkRole()) return <Navigate to="/login" />;
  return (
    <div className="container">
        <div className="cstmpadd">
            <CoordinatorPersonalPageComponent/>
        </div>
    </div>
  );
};

export default CoordinatorPersonalPageView;
