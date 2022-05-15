import PracticeListComponent from "../../components/StudentRole/practicelist/PracticeListComponent";
import { Tab, Tabs } from "react-bootstrap";
import {Navigate} from "react-router-dom";

import "./StudentHomeStyles.css";
import ReservedPracticeListComponent
  from "../../components/StudentRole/reservedPracticeList/ReservedPracticeListComponent";
import PastPracticeListComponent from "../../components/StudentRole/pastPracticeList/PastPracticeListComponent";

const checkRole = () => {
  console.log("hello");
  return localStorage.getItem("role") !== "ROLE_STUDENT";
};

const StudentHomeView = () => {
  if(checkRole()) return <Navigate to="/login"/>;
  return (
    <div className="studentHomeBody">
      <Tabs defaultActiveKey="tab1" id="tab" className="tab">
        <Tab eventKey="tab1" title="Dostupné praxe">
          <PracticeListComponent />
        </Tab>
        <Tab eventKey="tab2" title="Rezervované praxe">
          <ReservedPracticeListComponent />
        </Tab>
        <Tab eventKey="tab3" title="Proběhlé praxe">
          <PastPracticeListComponent />
        </Tab>
      </Tabs>
    </div>
  );
};

export default StudentHomeView;
