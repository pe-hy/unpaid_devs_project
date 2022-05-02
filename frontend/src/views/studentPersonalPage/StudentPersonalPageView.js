import "./StudentPersonalPageStyles.css";
import StudentPersonalPageComponent from "../../components/StudentRole/studentPersonalPage/StudentPersonalPageComponent.js";
import {Navigate} from "react-router-dom";

const checkRole = () => {
  console.log("storage",localStorage.getItem("role"));
  return localStorage.getItem("role") !== "ROLE_STUDENT";
};

const StudentPersonalPageView = () => {
  if (checkRole()) return <Navigate to="/login" />;
  return (
    <div className="container">
        <div className="cstmpadd">
            <StudentPersonalPageComponent/>
        </div>
    </div>
  );
};

export default StudentPersonalPageView;
