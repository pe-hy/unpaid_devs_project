import "./TeacherListedPractices.css";
import {Navigate} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {axios} from "../../../axios.js";
import {Container, Modal} from "react-bootstrap";

const URL = `${process.env.REACT_APP_AXIOS_URL}`;

const GET_PRACITCES_BY_TEACHER_URL = `${URL}/teacher/practices-list`;
const UNLOCK_USER_URL = `${URL}/coordinator/unlockUser`;
const REMOVE_USER_URL = `${URL}/coordinator/removeUser`;

export const TeacherListedPractices = () => {
    const [users, setUsers] = useState([]);
    const noUsers = !users || (users && users.length === 0);
    const [modalShow, setModalShow] = React.useState(false);
    const [currEmail, setCurrEmail] = useState("");
    const schoolNotFound = "Škola nevyplněna";

    const getTeacherPracticeList = async () => {
        if (checkRole()) return;
        const response = await axios({
            url: GET_PRACITCES_BY_TEACHER_URL,
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
        getTeacherPracticeList();
    }, []);

    const checkRole = () => {
        return localStorage.getItem("role") !== "ROLE_TEACHER";
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
                <div className="p-3 m-3 center myy-alert alert-success alertCustom">
                    <span>Nikdo z učitelů aktuálně nečeká na potvrzení registrace.</span>
                </div>
            </div>}
        </Container>
    );
};

export default TeacherListedPractices;
