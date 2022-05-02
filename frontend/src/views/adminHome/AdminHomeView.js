import { Tab, Tabs } from "react-bootstrap";
import "./AdminHomeStyles.css";
import {Navigate} from "react-router-dom";

const checkRole = () => {
    return localStorage.getItem("role") !== "ROLE_ADMIN";
};

const AdminHomeView = () => {
    if (checkRole()) return <Navigate to="/login" />;
    return (
        <div className="studentHomeBody">
            <Tabs defaultActiveKey="tab1" id="tab" className="tab">
                <Tab eventKey="tab1" title="Koordinátoři">
                    not implemented
                </Tab>
                <Tab eventKey="tab2" title="Učitelé">
                    not implemented
                </Tab>
                <Tab eventKey="tab3" title="Studenti">
                    not implemented
                </Tab>
            </Tabs>
        </div>
    );
};

export default AdminHomeView;
