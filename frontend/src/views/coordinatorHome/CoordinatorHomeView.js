import { Tab, Tabs } from "react-bootstrap";
import WaitingListComponent from "../../components/waitingList/WaitingListComponent";
import "./CoordinatorHomeStyles.css";

const CoordinatorHomeView = () => {
    return (
        <div className="studentHomeBody">
            <Tabs defaultActiveKey="tab1" id="tab" className="tab">
                <Tab eventKey="tab1" title="Uživatelé čekající na potvrzení">
                    <WaitingListComponent />
                </Tab>
                <Tab eventKey="tab2" title="Školy">
                    empty
                </Tab>
                <Tab eventKey="tab3" title="Předměty">
                    empty
                </Tab>
            </Tabs>
        </div>
    );
};

export default CoordinatorHomeView;
