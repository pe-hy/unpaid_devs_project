import React, { useEffect, useState } from "react";
import { axios } from "../../../axios";
import { Navigate } from "react-router-dom";
import { Alert, Button, ButtonGroup, Col, Container, Form, InputGroup, Modal, Row } from "react-bootstrap";
import { BsCheckLg, BsExclamationTriangleFill } from "react-icons/bs";
import "./AddSchoolComponent.css";
import Combobox from "react-widgets/Combobox";


export const AddSchoolComponent = () => {
    const [schools, setSchools] = useState([]);
    const [teachersWithoutSchool, setTeachersWithoutSchools] = useState([]);
    const noSchools = !schools || (schools && schools.length === 0);
    const [modalShow, setModalShow] = React.useState(false);
    const [assignSchoolModalShow, setAssignSchoolModalShow] = useState(false);
    const [currSchool, setCurrSchool] = useState("");
    const [selectedAssignSchool, setSelectedAssignSchool] = useState();
    const [currTeacher, setCurrTeacher] = useState();
    const [formData, setFormData] = useState({});
    const [showDangerAlert, setshowDangerAlert] = useState(false);
    const [showSuccessAlert, setshowSuccessAlert] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const checkRole = () => {
        return localStorage.getItem("role") !== "ROLE_COORDINATOR";
    };

    const removeSchool = async () => {
        const response = await axios({
            headers: { 'content-type': 'application/json' },
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
            getTeachersWithoutSchool();
        }
    };

    const assignSchoolToTeacher = async () => {
        const response = await axios({
            headers: { 'content-type': 'application/json' },
            url: "http://localhost:8080/coordinator/assignSchool",
            withCredentials: true,
            method: "POST",
            data: (currTeacher, selectedAssignSchool),
        }).catch((err) => {
            alert(err.response.data.message);
            console.log(err.response.data.message);
        });
        if (response && response.data) {
            console.log(response);
            setModalShow(false);
            getTeachersWithoutSchool();
        }
    }

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

    const getTeachersWithoutSchool = async () => {
        const response = await axios({
            url: "http://localhost:8080/coordinator/getTeachersWithoutSchool",
            withCredentials: true,
            method: "GET",
        }).then((response) => {
            setTeachersWithoutSchools(response.data);
        });
    };

    const selectAssignSchool = (value) => {
        let combo = document.getElementById("assign-school-combo");
        
    }

    function AssignSchoolModal(props) {
        console.log("oh oh no");
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
                    <h4>Přiřazení školy</h4>
                    <p>
                        Zvolte prosím školu pro učitele: {currTeacher != null ? currTeacher.firstName.concat(" ", currTeacher.secondName) : ""}
                    </p>
                    <Combobox
                        id="assign-school-combo"
                        data={schools}
                        value={selectedAssignSchool}
                        onChange={value => setSelectedAssignSchool(value)}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <button type="button" className="accept-btn my-btn-white" onClick={props.onHide}>Storno</button>
                    <button type="button" className="accept-btn" onClick={() => {
                        props.onHide();
                        assignSchoolToTeacher();
                    }}>Přiřadit školu
                    </button>
                </Modal.Footer>
            </Modal>
        );
    }

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
        setFormData({ ...formData, "name": e.target.value.trim() });
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
        getTeachersWithoutSchool();
    }, []);

    if (checkRole()) return <Navigate to="/login" />;
    return (
        <Container fluid>
            <Row>
                <div className="col p-3">
                    <h4 className="p-4">Přidání školy</h4>
                    <Form onSubmit={addSchool} id="Form">
                        <Row className="center">
                            <Form.Group
                                as={Row}
                                className="center m-5"
                                controlId="formHorizontalDatum"
                                role="form"
                            >
                                <Row className="center" sm={8}>
                                    <b className="center pb-4" style={{fontSize: "20px"}}>Název školy</b>
                                    <InputGroup>
                                        <Form.Control
                                            required="required"
                                            type="text"
                                            placeholder="Vložte název školy"
                                            onChange={handleChange}
                                        />
                                    </InputGroup>
                                    <Button type="submit" className={"button-add btn"}>Přidat</Button>
                                </Row>
                            </Form.Group>
                        </Row>
                    </Form>
                    <Alert
                        show={showDangerAlert}
                        variant="danger"
                        className="alert-school-error m-4 "
                    >
                        <BsExclamationTriangleFill className={"alert-icon-error"} /> {errorMsg}
                    </Alert>
                    <Alert
                        show={showSuccessAlert}
                        variant="success"
                        className="alert-school-success m-4"
                    >
                        <BsCheckLg className={"alert-icon-success"} /> Škola byla přidána
                    </Alert>
                </div>
                <div className="col p-3">
                    <h4 className="p-3">Seznam škol</h4>
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
            </Row>
            <CreateModal
                show={modalShow}
                onHide={() => setModalShow(false)}
            />
            <AssignSchoolModal
                show={assignSchoolModalShow}
                onHide={() => setAssignSchoolModalShow(false)}
            />
            <hr />
            {schools.length > 0 &&
                <div className="customAlertContainer">
                    <div className="w-75 p-2 m-3 center alertCustom">
                        <table className="table align-items-center">
                            <thead>
                                <tr>
                                    <th scope="col">Uživatelé bez přiřazené školy</th>
                                </tr>
                            </thead>
                            <tbody>
                                {teachersWithoutSchool.map((teacher, index) => (
                                    <tr className="align-middle">
                                        <td>{teacher.firstName.concat(" ", teacher.secondName, " (", teacher.username, ")")}</td>
                                        <td>
                                            <button onClick={() => {
                                                setAssignSchoolModalShow(true);
                                                setCurrTeacher(teacher);
                                            }} type="button" className="accept-btn">Přiřadit školu
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>}
        </Container>
    );
};
export default AddSchoolComponent;
