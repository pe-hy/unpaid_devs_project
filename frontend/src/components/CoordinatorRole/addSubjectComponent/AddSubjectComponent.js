import React, { useEffect, useState } from "react";
import { axios } from "../../../axios";
import { Navigate } from "react-router-dom";
import { Alert, Button, Container, Form, InputGroup, Modal, Row } from "react-bootstrap";
import { BsCheckLg, BsExclamationTriangleFill, BsFillPencilFill } from "react-icons/bs";
import "./AddSubjectComponent.css";

const URL = `${process.env.REACT_APP_AXIOS_URL}`;

const REMOVE_SUBJECT_URL = `${URL}/coordinator/removeSubject`;
const GET_SUBJECTS_URL = `${URL}/user/subjects`;
const ADD_SUBJECT_URL = `${URL}/coordinator/addSubject`;
const EDIT_SUBJECT_URL = `${URL}/coordinator/editSubject`;

const MAX_TEXT_LENGTH = 50;
const MIN_TEXT_LENGTH = 2;
const LENGTH_ERROR_MSG = "Špatná délka předmětu (2 - 50 znaků)";


export const AddSubjectComponent = () => {
    const [subjects, setSubjects] = useState([]);
    const noSubjects = !subjects || (subjects && subjects.length === 0);
    const [modalShow, setModalShow] = React.useState(false);
    const [currSubject, setCurrSubject] = useState("");
    const [formData, setFormData] = useState({});
    const [showDangerAlert, setshowDangerAlert] = useState(false);
    const [showSuccessAlert, setshowSuccessAlert] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const newSubjectName = useState("");
    const checkRole = () => {
        return localStorage.getItem("role") !== "ROLE_COORDINATOR";
    };

    const validate = () => {
        if (newSubjectName[0].length < MIN_TEXT_LENGTH || newSubjectName[0].length > MAX_TEXT_LENGTH) {
            setErrorMsg(LENGTH_ERROR_MSG);
            return false;
        }
        return true;
    }

    const validateAddSubject = () => {
        if (formData.name.length < MIN_TEXT_LENGTH || formData.name.length > MAX_TEXT_LENGTH) {
            setErrorMsg(LENGTH_ERROR_MSG);
            return false;
        }
        return true;
    }

    const removeSubject = async () => {
        const response = await axios({
            headers: { 'content-type': 'application/json' },
            url: REMOVE_SUBJECT_URL,
            withCredentials: true,
            method: "POST",
            data: currSubject,
        }).catch((err) => {
            alert(err.response.data.message);
            console.log(err.response.data.message);
        });
        if (response && response.data) {
            console.log(response);
            setModalShow(false);
            getSubjects();
        }
    };

    const editSubject = async () => {
        let form = { "originalSubject": currSubject, "newSubject": newSubjectName[0] };
        const response = await axios({
            headers: { 'content-type': 'application/json' },
            url: EDIT_SUBJECT_URL,
            withCredentials: true,
            method: "POST",
            data: form,
        }).catch((err) => {
            alert(err.response.data.message);
            console.log(err.response.data.message);
        });
        if (response && response.data) {
            setModalShow(false);
            getSubjects();
        }
    };

    const getSubjects = async () => {
        const response = await axios({
            url: GET_SUBJECTS_URL,
            withCredentials: true,
            method: "GET",
        }).then((response) => {
            const sch = [];
            response.data.forEach(element => sch.push(element.name));
            setSubjects(sch);
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
                    <h4>Vymázání předmětu</h4>
                    <p>
                        Jste si jisti, že chcete tento předmět odstranit? Tato akce je nevratná.

                        <p className="mt-4"><b>Pokud smažete předmět, odstraníte tím veškeré praxe s tímto
                            předmětem.</b></p>
                    </p>
                </Modal.Body>
                <Modal.Footer>
                    <button type="button" className="accept-btn my-btn-white" onClick={props.onHide}>Storno</button>
                    <button type="button" className="removal-btn" onClick={() => {
                        props.onHide();
                        removeSubject();
                    }}>Smazat předmět
                    </button>
                </Modal.Footer>
            </Modal>
        );
    }

    function EditSubjectModal(props) {
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
                    <h4>Úprava názvu předmětu</h4>
                    <p>
                        Napište prosím nový název pro předmět: {currSubject}
                    </p>
                    <InputGroup>
                        <Form.Control
                            id={"subject_edit_input"}
                            required="required"
                            type="text"
                            placeholder="Vložte nový název předmětu"
                        />
                    </InputGroup>

                </Modal.Body>
                <Modal.Footer>
                    <button type="button" className="accept-btn my-btn-white" onClick={props.onHide}>Storno</button>
                    <button type="button" className="accept-btn" onClick={() => {
                        const subjectEdit = document.getElementById("subject_edit_input");
                        const value = subjectEdit.value;
                        newSubjectName[0] = value;
                        if (validate()) {
                            props.onHide();
                            editSubject();
                            setshowSuccessAlert(false);
                        }
                        else {
                            props.onHide();
                            setshowDangerAlert(true);
                            setshowSuccessAlert(false);
                        }
                    }}>Upravit předmět
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

    const addSubject = async (event) => {
        event.preventDefault();
        if (!validateAddSubject()) {
            setshowDangerAlert(true);
        }
        else {
            const response = await axios({
                url: ADD_SUBJECT_URL,
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
                getSubjects();
            });
            if (response) {
                setshowDangerAlert(false);
                setshowSuccessAlert(true);
                document.getElementById("add_subject_input").value = "";
                await getSubjects();
            }
        }
    };

    useEffect(() => {
        getSubjects();
    }, []);

    if (checkRole()) return <Navigate to="/login" />;
    return (
        <Container fluid>
            <Row>
                <div className="col p-3">
                    <h4 className="p-3">Přidání předmětu</h4>
                    <Form onSubmit={addSubject} id="Form">
                        <Row className="center">
                            <Form.Group
                                as={Row}
                                className="center m-5"
                                controlId="formHorizontalDatum"
                                role="form"
                            >
                                <Row className="center" sm={8}>
                                    <b className="center pb-4" style={{ fontSize: "20px" }}>Název předmětu</b>
                                    <InputGroup>
                                        <Form.Control
                                            id={"add_subject_input"}
                                            required="required"
                                            type="text"
                                            placeholder="Vložte název předmětu"
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
                        className="alert-school-error m-4"
                    >
                        <BsExclamationTriangleFill className={"alert-icon-error"} /> {errorMsg}
                    </Alert>
                    <Alert
                        show={showSuccessAlert}
                        variant="success"
                        className="alert-school-success m-4"
                    >
                        <BsCheckLg className={"alert-icon-success"} /> Předmět byl přidán
                    </Alert>
                </div>
                <div className="col p-3">
                    <h4 className="p-3">Seznam předmětů</h4>
                    <div className="center">
                        <table className="w-75 table table-striped align-items-center">
                            <thead>
                                <tr>
                                    <th scope="col">Předmět</th>
                                </tr>
                            </thead>
                            <tbody>
                                {!noSubjects &&
                                    subjects.map((item, index) => (
                                        <tr key={index} className="align-middle">
                                            <td className="w-100">{item}</td>
                                            <td style={{ textAlign: "center" }}>
                                                <button onClick={() => {
                                                    setModalShow(true);
                                                    setCurrSubject(item);
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
            <EditSubjectModal
                show={modalShow}
                onHide={() => setModalShow(false)}
            />
        </Container>
    );
};
export default AddSubjectComponent;
