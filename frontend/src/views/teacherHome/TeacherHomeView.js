import { Tab, Tabs } from "react-bootstrap";
import AddPracticeComponent from "../../components/TeacherRole/addPracticeForm/AddPracticeComponent";
import {Navigate} from "react-router-dom";
import "./TeacherHomeStyles.css";
import TeacherListedPractices from "../../components/TeacherRole/teacherListedPractices/TeacherListedPractices";
import TeacherPassedPractices from "../../components/TeacherRole/teacherPassedPractices/TeacherPassedPractices";
import CoordinatorsComponent from "../../components/UnspecifiedRoles/users/CoordinatorsComponent";

const checkRole = () => {
  return localStorage.getItem("role") !== "ROLE_TEACHER";
};

const TeacherHomeView = () => {
  if(checkRole()) return <Navigate to="/login"/>;
  return (
    <div className="studentHomeBody">
      <Tabs defaultActiveKey="tab1" id="tab" className="tab">
        <Tab eventKey="tab1" title="Vypsané praxe">
          <TeacherListedPractices />
        </Tab>
        <Tab eventKey="tab2" title="Proběhlé praxe">
          <TeacherPassedPractices />
        </Tab>
        <Tab eventKey="tab3" title="Přidání praxe">
          <AddPracticeComponent />
        </Tab>
        <Tab eventKey="tab4" title="Koordinátoři">
          <CoordinatorsComponent />
        </Tab>
      </Tabs>
    </div>
  );
};

export default TeacherHomeView;
