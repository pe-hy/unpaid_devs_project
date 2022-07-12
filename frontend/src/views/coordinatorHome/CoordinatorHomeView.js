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
import ShowStudents from "../../components/UnspecifiedRoles/users/StudentsComponent";
import ShowTeachers from "../../components/UnspecifiedRoles/users/TeachersComponent";
import ShowCoordinators from "../../components/UnspecifiedRoles/users/CoordinatorsComponent";
import AdminAddCoordinatorComponent from "../../components/AdminRole/AdminAddCoordinator/AdminAddCoordinatorComponent.js";
import PassedPracticesCoordinatorExport
    from "../../components/CoordinatorRole/passedPracticesCoordinatorExport/PassedPracticesCoordinatorExport";

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
                <Tab eventKey="tab2" title="Přidání koordinátora">
                    <AdminAddCoordinatorComponent />
                </Tab>
                <Tab eventKey="tab3" title="Školy">
                    <AddSchoolComponent />
                </Tab>
                <Tab eventKey="tab4" title="Předměty">
                    <AddSubjectComponent />
                </Tab>
                <Tab eventKey="tab5" title="Vypsané praxe">
                    <PracticesListCoordinator />
                </Tab>
                <Tab eventKey="tab6" title="Proběhlé praxe">
                    <PassedPracticesCoordinator />
                </Tab>
                <Tab eventKey="tab7" title="Export praxí">
                    <PassedPracticesCoordinatorExport />
                </Tab>
                <Tab eventKey="tab8" title="Studenti">
                    <ShowStudents />
                </Tab>
                <Tab eventKey="tab9" title="Učitelé">
                    <ShowTeachers />
                </Tab>
                <Tab eventKey="tab10" title="Koordinátoři">
                    <ShowCoordinators />
                </Tab>
            </Tabs>
        </div>
    );
};

export default CoordinatorHomeView;
