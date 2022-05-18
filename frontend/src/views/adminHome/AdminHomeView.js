import { Tab, Tabs } from "react-bootstrap";
import "./AdminHomeStyles.css";
import {Navigate} from "react-router-dom";
import AdminAddCoordinatorComponent from "../../components/AdminRole/AdminAddCoordinator/AdminAddCoordinatorComponent.js";
import ShowTeachers from "../../components/UnspecifiedRoles/users/TeachersComponent";
import ShowStudents from "../../components/UnspecifiedRoles/users/StudentsComponent";
import ShowCoordinators from "../../components/UnspecifiedRoles/users/CoordinatorsComponent";

const checkRole = () => {
    return localStorage.getItem("role") !== "ROLE_ADMIN";
};

const AdminHomeView = () => {
    if (checkRole()) return <Navigate to="/login" />;
    return (
        <div className="studentHomeBody">
            <Tabs defaultActiveKey="tab1" id="tab" className="tab">
                <Tab eventKey="tab1" title="Přidání koordinátora">
                    <AdminAddCoordinatorComponent />
                </Tab>
                <Tab eventKey="tab2" title="Učitelé">
                    <ShowTeachers />
                </Tab>
                <Tab eventKey="tab3" title="Studenti">
                    <ShowStudents />
                </Tab>
                <Tab eventKey="tab4" title="Koordinátoři">
                    <ShowCoordinators />
                </Tab>
            </Tabs>
        </div>
    );
};

export default AdminHomeView;
