import React, {useEffect, useState} from "react";
import {axios} from "../../../axios";
import {Navigate} from "react-router-dom";
import {Alert, Col, Container, Form, InputGroup, Modal, Row} from "react-bootstrap";
import {BsCheckLg, BsExclamationTriangleFill} from "react-icons/bs";

export const AddSchoolComponent = () => {
    const [schools, setSchools] = useState([]);
    const noSchools = !schools || (schools && schools.length === 0);
    const [modalShow, setModalShow] = React.useState(false);
    const [currSchool, setCurrSchool] = useState("");
    const [formData, setFormData] = useState({});
    const [showDangerAlert, setshowDangerAlert] = useState(false);
    const [showSuccessAlert, setshowSuccessAlert] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
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

    const handleChange = (e) => {
        setshowSuccessAlert(false);
        setFormData({...formData, "name": e.target.value.trim()});
        console.log(formData);
    };

    const addSchool = async (event) => {
        event.preventDefault();
        const response = await axios({
            url: `http://localhost:8080/coordinator/addSchool`,
            withCredentials: true,
            method: "POST",
            data: formData,
        }).catch((err) => {
            let msg = err.response.data["message"];
            msg = msg.split(":")[1];
            setErrorMsg(msg);
            setshowSuccessAlert(false);
            setshowDangerAlert(true);
            console.log(err.response.data);
            getSchools();
        });
        if (response) {
            setshowDangerAlert(false);
            setshowSuccessAlert(true);
            await getSchools();
        }
    };

    useEffect(() => {
        getSchools();
    }, []);

    if (checkRole()) return <Navigate to="/login"/>;
    return (
        <Container fluid>
            <div className="d-flex">
                <div className="col">
                    Přidání školy
                    <Form onSubmit={addSchool} id="Form">
                        <Row>
                            <Form.Group
                                as={Row}
                                className="m-3"
                                controlId="formHorizontalDatum"
                                role="form"
                            >
                                <Col sm={3}>Název školy</Col>
                                <Col sm={8}>
                                    <InputGroup>
                                        <Form.Control
                                            required="required"
                                            type="text"
                                            placeholder="Základní škola Čeladná"
                                            onChange={handleChange}
                                        />
                                    </InputGroup>
                                </Col>
                            </Form.Group>
                        </Row>
                    </Form>
                    <Alert
                        show={showDangerAlert}
                        variant="danger"
                        className="alert-practice-error m-4 p-4"
                    >
                        <BsExclamationTriangleFill className={"alert-icon-error"}/> {errorMsg}
                    </Alert>
                    <Alert
                        show={showSuccessAlert}
                        variant="success"
                        className="alert-practice-success m-4 p-4"
                    >
                        <BsCheckLg className={"alert-icon-success"}/> Škola byla přidána
                    </Alert>
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
