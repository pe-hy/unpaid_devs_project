import "./TeacherPersonalPageStyles.css";
import TeacherPersonalPageComponent from "../../components/TeacherRole/teacherPersonalPage/TeacherPersonalPageComponent";
import {Navigate} from "react-router-dom";

const checkRole = () => {
  return localStorage.getItem("role") !== "ROLE_TEACHER";
};

const TeacherHomeView = () => {
  if(checkRole()) return <Navigate to="/login"/>;
  return (
    <div className="container">
        <div className="cstmpadd">
            <TeacherPersonalPageComponent/>
        </div>
    </div>
  );
};

export default TeacherHomeView;
