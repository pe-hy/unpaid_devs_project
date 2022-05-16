import { Tab, Tabs } from "react-bootstrap";
import WaitingListComponent from "../../components/CoordinatorRole/waitingList/WaitingListComponent";
import "./CoordinatorHomeStyles.css";
import AddSchoolComponent from "../../components/CoordinatorRole/addSchoolComponent/AddSchoolComponent";
import AddSubjectComponent from "../../components/CoordinatorRole/addSubjectComponent/AddSubjectComponent";
import {Navigate} from "react-router-dom";
import PassedPracticesCoordinator
    from "../../components/CoordinatorRole/passedPracticesCoordinator/PassedPracticesCoordinator";
import PracticesListCoordinator
    from "../../components/CoordinatorRole/practicesListCoordinator/PracticesListCoordinator";

const checkRole = () => {
    return localStorage.getItem("role") !== "ROLE_COORDINATOR";
};

const CoordinatorHomeView = () => {
    if (checkRole()) return <Navigate to="/login" />;
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
                <Tab eventKey="tab4" title="Vypsané praxe">
                    <PracticesListCoordinator />
                </Tab>
                <Tab eventKey="tab5" title="Proběhlé praxe">
                    <PassedPracticesCoordinator />
                </Tab>
            </Tabs>
        </div>
    );
};

export default CoordinatorHomeView;
