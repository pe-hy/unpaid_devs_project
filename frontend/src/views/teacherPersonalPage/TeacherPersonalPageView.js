import "./TeacherPersonalPageStyles.css";
import FileManagementComponent from "../../components/teacherPersonalPage/FileManagementComponent";

const TeacherHomeView = () => {
  
  return (
    <div className="container">
        <div className="cstmpadd">
            <FileManagementComponent/>
        </div>
    </div>
  );
};

export default TeacherHomeView;
