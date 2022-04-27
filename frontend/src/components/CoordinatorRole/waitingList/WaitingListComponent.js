import "./WaitingListComponent.css";
import {Navigate} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {axios} from "../../../axios.js";
import {Container, Modal} from "react-bootstrap";

export const WaitingListComponent = () => {
    const [users, setUsers] = useState([]);
    const noUsers = !users || (users && users.length === 0);
    const [modalShow, setModalShow] = React.useState(false);
    const [currEmail, setCurrEmail] = useState("");
    const schoolNotFound = "Škola nevyplněna";

    const getLockedUsers = async () => {
        if (checkRole()) return;
        const response = await axios({
            url: "http://localhost:8080/coordinator/waitingList",
            withCredentials: true,
            method: "GET",
        }).catch((err) => {
            alert(err.response.data.message);
            console.log(err.response.data.message);
        });
        if (response && response.data) {
            console.log(response);
            setUsers(response.data);
        }
    };

    useEffect(() => {
        getLockedUsers();
    }, []);

    const acceptUser = async (email) => {
        const response = await axios({
            headers: {'content-type': 'application/json'},
            url: "http://localhost:8080/coordinator/unlockUser",
            withCredentials: true,
            method: "POST",
            data: email,
        }).catch((err) => {
            console.log(err.response.data.message);
        });
        if (response && response.data) {
            console.log(response);
            getLockedUsers();
        }
    };

    const removeUser = async () => {
        const response = await axios({
            headers: {'content-type': 'application/json'},
            url: "http://localhost:8080/coordinator/removeUser",
            withCredentials: true,
            method: "POST",
            data: currEmail,
        }).catch((err) => {
            alert(err.response.data.message);
            console.log(err.response.data.message);
        });
        if (response && response.data) {
            console.log(response);
            setModalShow(false);
            getLockedUsers();
        }
    };

    function CreateModal(props) {
        return (
            <Modal
                {...props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                </Modal.Header>
                <Modal.Body>
                    <h4>Zamítnutí žádosti o registraci</h4>
                    <p>
                        Jste si jisti, že chcete tohoto uživatele odstranit? Tato akce je nevratná.
                    </p>
                </Modal.Body>
                <Modal.Footer>
                    <button type="button" className="accept-btn my-btn-white" onClick={props.onHide}>Storno</button>
                    <button type="button" className="removal-btn" onClick={() => {
                        props.onHide();
                        removeUser();
                    }}>Zamítnout
                    </button>
                </Modal.Footer>
            </Modal>
        );
    }

    const checkRole = () => {
        return localStorage.getItem("role") !== "ROLE_COORDINATOR";
    };

    if (checkRole()) return <Navigate to="/login"/>;
    return (
        <Container fluid>
            <table className="table table-striped">
                <thead>
                <tr>
                    <th scope="col">Jméno</th>
                    <th scope="col">Škola</th>
                    <th scope="col">Telefon</th>
                    <th scope="col">Email</th>
                </tr>
                </thead>
                <tbody>
                {!noUsers &&
                users.map((item, index) => (
                    <tr className="align-middle">
                        <th scope="row">{item.firstName + " " + item.secondName}</th>
                        <td>{item.school != null ? item.school.name : schoolNotFound}</td>
                        <td>{item.phoneNumber}</td>
                        <td>{item.username}</td>
                        <td>
                            <button onClick={() => acceptUser(item.username)} type="button"
                                    className="accept-btn">Potvrdit
                            </button>
                        </td>
                        <td>
                            <button onClick={() => {
                                setModalShow(true);
                                setCurrEmail(item.username);
                            }} type="button" className="removal-btn">Zamítnout
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            {users.length < 1 &&
            <div className="customAlertContainer">
                <div className="w-50 p-2 m-3 center alert-success alertCustom">
                    <span>Nikdo z uživatelů aktuálně nečeká na registraci.</span>
                </div>
            </div>}
            <CreateModal
                show={modalShow}
                onHide={() => setModalShow(false)}
            />
        </Container>
    );
};

export default WaitingListComponent;
