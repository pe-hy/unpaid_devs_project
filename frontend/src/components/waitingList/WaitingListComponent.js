import "./WaitingListComponent.css";
import {Navigate} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {axios} from "../../axios.js";
import {Container, Modal, Button} from "react-bootstrap";

export const WaitingListComponent = () => {
    const [users, setUsers] = useState([]);
    const noUsers = !users || (users && users.length === 0);
    const [modalShow, setModalShow] = React.useState(false);

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

    const acceptUser = async (id) => {
        const response = await axios({
            url: `coordinator/users/${id}/acceptUser`,
            withCredentials: true,
            method: "PUT",
        }).catch((err) => {
            alert(err.response.data.message);
            console.log(err.response.data.message);
        });
        if (response && response.data) {
            console.log(response);
            setUsers(response.data);
        }
        await getLockedUsers();
    };

    const removeUser = async (id) => {
        const response = await axios({
            url: `coordinator/users/${id}/removeUser`,
            withCredentials: true,
            method: "PUT",
        }).catch((err) => {
            alert(err.response.data.message);
            console.log(err.response.data.message);
        });
        if (response && response.data) {
            console.log(response);
            setUsers(response.data);
        }
        await getLockedUsers();
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
                    <button type="button" className="removal-btn" onClick={props.onHide}>Zamítnout</button>
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
                    <td>{item.school.name}</td>
                    <td>{item.phoneNumber}</td>
                    <td>{item.username}</td>
                    <td><button type="button" className="accept-btn">Potvrdit</button></td>
                    <td><button onClick={() => setModalShow(true)} type="button" className="removal-btn">Zamítnout</button></td>
                </tr>
            ))}
            </tbody>
            </table>
            <CreateModal
                show={modalShow}
                onHide={() => setModalShow(false)}
            />
        </Container>
    );
};

export default WaitingListComponent;
