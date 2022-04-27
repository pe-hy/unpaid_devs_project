import { Tab, Tabs } from "react-bootstrap";
import WaitingListComponent from "../../components/CoordinatorRole/waitingList/WaitingListComponent";
import "./CoordinatorHomeStyles.css";
import AddSchoolComponent from "../../components/CoordinatorRole/addSchoolComponent/AddSchoolComponent";
import AddSubjectComponent from "../../components/CoordinatorRole/addSubjectComponent/AddSubjectComponent";

const CoordinatorHomeView = () => {
    return (
        <div className="studentHomeBody">
            <Tabs defaultActiveKey="tab1" id="tab" className="tab">
                <Tab eventKey="tab1" title="Uživatelé čekající na potvrzení">
                    <WaitingListComponent />
                </Tab>
                <Tab eventKey="tab2" title="Školy">
                    <AddSchoolComponent />
                </Tab>
                <Tab eventKey="tab3" title="Předměty">
                    <AddSubjectComponent />
                </Tab>
            </Tabs>
        </div>
    );
};

export default CoordinatorHomeView;
