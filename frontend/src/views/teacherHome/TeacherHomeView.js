import { Tab, Tabs } from "react-bootstrap";
import AddPracticeComponent from "../../components/TeacherRole/addPracticeForm/AddPracticeComponent";
import "./TeacherHomeStyles.css";

const TeacherHomeView = () => {
  return (
    <div className="studentHomeBody">
      <Tabs defaultActiveKey="tab1" id="tab" className="tab">
        <Tab eventKey="tab1" title="Přidání praxe">
          <AddPracticeComponent />
        </Tab>
        <Tab eventKey="tab2" title="Vypsané praxe">
          empty
        </Tab>
        <Tab eventKey="tab3" title="Proběhlé praxe">
          empty
        </Tab>
      </Tabs>
    </div>
  );
};

export default TeacherHomeView;
