import PracticeListComponent from "../../components/practicelist/PracticeListComponent";
import { Tab, Tabs } from "react-bootstrap";

import "./StudentHomeStyles.css";

const StudentHomeView = () => {
  return (
    <div className="studentHomeBody">
      <Tabs defaultActiveKey="tab1" id="tab" className="tab">
        <Tab eventKey="tab1" title="Dostupné praxe">
          <PracticeListComponent />
        </Tab>
        <Tab eventKey="tab2" title="Rezervované praxe">empty</Tab>
        <Tab eventKey="tab3" title="Proběhlé praxe">empty</Tab>
      </Tabs>
    </div>
  );
};

export default StudentHomeView;
