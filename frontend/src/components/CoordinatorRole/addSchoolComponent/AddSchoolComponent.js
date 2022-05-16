import React, { useEffect, useState } from "react";
import { axios } from "../../../axios";
import { Navigate } from "react-router-dom";
import { Alert, Button, ButtonGroup, Col, Container, Form, InputGroup, Modal, Row } from "react-bootstrap";
import { BsCheckLg, BsExclamationTriangleFill } from "react-icons/bs";
import "./AddSchoolComponent.css";
import Combobox from "react-widgets/Combobox";
import { BsFillPencilFill } from "react-icons/bs";
const URL = `${process.env.REACT_APP_AXIOS_URL}`;

const REMOVE_SCHOOL_URL = `${URL}/coordinator/removeSchool`;
const EDIT_SCHOOL_URL = `${URL}/coordinator/editSchool`;
const ASSIGN_SCHOOL_URL = `${URL}/coordinator/assignSchool`;
const GET_SCHOOLS_URL = `${URL}/user/schools`;
const GET_TEACHERS_WITHOUT_SCHOOL_URL = `${URL}/coordinator/getTeachersWithoutSchool`;
const ADD_SCHOOL_URL = `${URL}/coordinator/addSchool`;

const MAX_TEXT_LENGTH = 50;
const MIN_TEXT_LENGTH = 10;
const LENGTH_ERROR_MSG = "Špatná délka školy (10 - 50 znaků)";


export const AddSchoolComponent = () => {
    const [schools, setSchools] = useState([]);
    const [teachersWithoutSchool, setTeachersWithoutSchools] = useState([]);

    const [modalShow, setModalShow] = React.useState(false);
    const [assignSchoolModalShow, setAssignSchoolModalShow] = useState(false);

    const [currSchool, setCurrSchool] = useState("");
    const [currTeacher, setCurrTeacher] = useState();
    const currAssignedSchool = useState("");
    const newSchoolName = useState("");

    const [formData, setFormData] = useState({});

    const [showDangerAlert, setshowDangerAlert] = useState(false);
    const [showSuccessAlert, setshowSuccessAlert] = useState(false);

    const [errorMsg, setErrorMsg] = useState("");

    const validate = () => {
        if (newSchoolName[0].length < MIN_TEXT_LENGTH || newSchoolName[0].length > MAX_TEXT_LENGTH) {
            setErrorMsg(LENGTH_ERROR_MSG);
            return false;
        }
        return true;
    }

    const validateAddSchool = () => {
        if (formData.name.length < MIN_TEXT_LENGTH || formData.name.length > MAX_TEXT_LENGTH) {
            setErrorMsg(LENGTH_ERROR_MSG);
            return false;
        }
        return true;
    }

    const removeSchool = async () => {
        const response = await axios({
            headers: { 'content-type': 'application/json' },
            url: REMOVE_SCHOOL_URL,
            withCredentials: true,
            method: "POST",
            data: currSchool,
        }).catch((err) => {
            alert(err.response.data.message);
            console.log(err.response.data.message);
        });
        if (response && response.data) {
            setModalShow(false);
            getSchools();
            getTeachersWithoutSchool();
        }
    };

    const editSchool = async () => {
        let form = { "originalSchool": currSchool, "newSchool": newSchoolName[0] };
        const response = await axios({
            headers: { 'content-type': 'application/json' },
            url: EDIT_SCHOOL_URL,
            withCredentials: true,
            method: "POST",
            data: form,
        }).catch((err) => {
            alert(err.response.data.message);
            console.log(err.response.data.message);
        });
        if (response && response.data) {
            setModalShow(false);
            getSchools();
            getTeachersWithoutSchool();
        }
    };

    const assignSchoolToTeacher = async () => {
        let form = { "username": currTeacher.username, "school": currAssignedSchool[0] };
        const response = await axios({
            headers: { 'content-type': 'application/json' },
            url: ASSIGN_SCHOOL_URL,
            withCredentials: true,
            method: "POST",
            data: form,
        }).catch((err) => {
            alert(err.response.data.message);
            console.log(err.response.data.message);

        });
        if (response && response.data) {
            setModalShow(false);
            getTeachersWithoutSchool();

        }
    }

    const getSchools = async () => {
        const response = await axios({
            url: GET_SCHOOLS_URL,
            withCredentials: true,
            method: "GET",
        }).then((response) => {
            var sch = [];
            response.data.forEach(element => sch.push(element.name));
            setSchools(sch);
        });
    };

    const selectSchoolChange = (value) => {
        var combobox = document.getElementById("combo_input");
        currAssignedSchool[0] = value
        combobox.value = value;
    }

    const getTeachersWithoutSchool = async () => {
        const response = await axios({
            url: GET_TEACHERS_WITHOUT_SCHOOL_URL,
            withCredentials: true,
            method: "GET",
        }).then((response) => {
            setTeachersWithoutSchools(response.data);
        });
    };

    function AssignSchoolModal(props) {
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
                        id={"combo"}
                        data={schools}
                        onChange={value => selectSchoolChange(value)}
                    />

                </Modal.Body>
                <Modal.Footer>
                    <button type="button" className="accept-btn my-btn-white" onClick={props.onHide}>Storno</button>
                    <button type="button" className="accept-btn" onClick={() => {
                        props.onHide();
                        assignSchoolToTeacher();
                        currAssignedSchool[1]("");
                    }}>Přiřadit školu
                    </button>
                </Modal.Footer>
            </Modal>
        );
    }

    function EditSchoolModal(props) {
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
                    <h4>Úprava názvu školy</h4>
                    <p>
                        Napište prosím nový název pro školu: {currSchool}
                    </p>
                    <InputGroup>
                        <Form.Control
                            id={"school_edit_input"}
                            required="required"
                            type="text"
                            placeholder="Vložte nový název školy"
                        />
                    </InputGroup>

                </Modal.Body>
                <Modal.Footer>
                    <button type="button" className="accept-btn my-btn-white" onClick={props.onHide}>Storno</button>
                    <button type="button" className="accept-btn" onClick={() => {
                        var schoolEdit = document.getElementById("school_edit_input");
                        var value = schoolEdit.value;
                        newSchoolName[0] = value
                        if (validate()) {
                            props.onHide();
                            editSchool();
                            setshowSuccessAlert(false);
                        }
                        else {
                            props.onHide();
                            setshowDangerAlert(true);
                            setshowSuccessAlert(false);
                        }

                    }}>Upravit školu
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
        setshowDangerAlert(false);
        setFormData({ ...formData, "name": e.target.value.trim() });
    };

    const addSchool = async (event) => {
        event.preventDefault();
        if (!validateAddSchool()) {
            setshowDangerAlert(true);
        }
        else {
            event.preventDefault();
            const response = await axios({
                url: ADD_SCHOOL_URL,
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
                document.getElementById("add_school_input").value = "";
                await getSchools();
            }
        }
    };

    useEffect(() => {
        getSchools();
        getTeachersWithoutSchool();
    }, []);

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
                                    <b className="center pb-4" style={{ fontSize: "20px" }}>Název školy</b>
                                    <InputGroup>
                                        <Form.Control
                                            id={"add_school_input"}
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
                    <div className="center">
                        <table className="w-75 table table-striped align-items-center">
                            <thead>
                                <tr>
                                    <th scope="col">Škola</th>
                                </tr>
                            </thead>
                            <tbody>
                                {schools &&
                                    schools.map((item, index) => (
                                        <tr key={index} className="align-middle">
                                            <td><span>{item}</span></td>
                                            <td style={{ textAlign: "center" }}>
                                                <button onClick={() => {
                                                    setModalShow(true);
                                                    setCurrSchool(item);
                                                    setshowDangerAlert(false);
                                                }} type="button" className="edit-btn"><BsFillPencilFill />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </Row>
            <EditSchoolModal
                show={modalShow}
                onHide={() => setModalShow(false)}
            />
        </Container>
    );
};
export default AddSchoolComponent;
