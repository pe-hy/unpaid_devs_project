import React, {useEffect, useState} from "react";
import {axios} from "../../../axios";
import {Navigate} from "react-router-dom";
import {Container, Modal} from "react-bootstrap";

export const AddSchoolComponent = () => {
    const [schools, setSchools] = useState([]);
    const noSchools = !schools || (schools && schools.length === 0);
    const [modalShow, setModalShow] = React.useState(false);
    const [currSchool, setCurrSchool] = useState("");
    const checkRole = () => {
        return localStorage.getItem("role") !== "ROLE_COORDINATOR";
    };

    const removeSchool = async () => {
        const response = await axios({
            headers: {'content-type': 'application/json'},
            url: "http://localhost:8080/coordinator/removeSchool",
            withCredentials: true,
            method: "POST",
            data: currSchool,
        }).catch((err) => {
            alert(err.response.data.message);
            console.log(err.response.data.message);
        });
        if (response && response.data) {
            console.log(response);
            setModalShow(false);
            getSchools();
        }
    };

    const getSchools = async () => {
        const response = await axios({
            url: "http://localhost:8080/user/schools",
            withCredentials: true,
            method: "GET",
        }).then((response) => {
            var sch = [];
            response.data.forEach(element => sch.push(element.name));
            setSchools(sch);
        });
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
                    <h4>Vymazání školy</h4>
                    <p>
                        Jste si jisti, že chcete tutu školu odstranit? Tato akce je nevratná.
                    </p>
                </Modal.Body>
                <Modal.Footer>
                    <button type="button" className="accept-btn my-btn-white" onClick={props.onHide}>Storno</button>
                    <button type="button" className="removal-btn" onClick={() => {
                        props.onHide();
                        removeSchool();
                    }}>Smazat školu
                    </button>
                </Modal.Footer>
            </Modal>
        );
    }

    useEffect(() => {
        getSchools();
    }, []);

    if (checkRole()) return <Navigate to="/login"/>;
    return (
        <Container fluid>
            <div className="d-flex">
                <div className="col">
                    Přidání školy

                </div>
                <div className="col">
                    <table className="table table-striped align-items-center">
                        <thead>
                        <tr>
                            <th scope="col">Škola</th>
                        </tr>
                        </thead>
                        <tbody>
                        {!noSchools &&
                        schools.map((item, index) => (
                            <tr className="align-middle">
                                <td>{item}</td>
                                <td>
                                    <button onClick={() => {
                                        setModalShow(true);
                                        setCurrSchool(item);
                                    }} type="button" className="removal-btn">X
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <CreateModal
                show={modalShow}
                onHide={() => setModalShow(false)}
            />
        </Container>
    );
};
export default AddSchoolComponent;
