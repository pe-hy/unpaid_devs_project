import React, {useEffect, useState} from "react";
import {axios} from "../../../axios";
import {Navigate} from "react-router-dom";
import {Alert, Button, ButtonGroup, Col, Container, Form, InputGroup, Modal, Row} from "react-bootstrap";
import {BsCheckLg, BsExclamationTriangleFill} from "react-icons/bs";
import "./AddSubjectComponent.css";


export const AddSubjectComponent = () => {
    const [subjects, setSubjects] = useState([]);
    const noSubjects = !subjects || (subjects && subjects.length === 0);
    const [modalShow, setModalShow] = React.useState(false);
    const [currSchool, setCurrSchool] = useState("");
    const [formData, setFormData] = useState({});
    const [showDangerAlert, setshowDangerAlert] = useState(false);
    const [showSuccessAlert, setshowSuccessAlert] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const checkRole = () => {
        return localStorage.getItem("role") !== "ROLE_COORDINATOR";
    };

    const removeSubject = async () => {
        const response = await axios({
            headers: {'content-type': 'application/json'},
            url: "http://localhost:8080/coordinator/removeSubject",
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
            getSubjects();
        }
    };

    const getSubjects = async () => {
        const response = await axios({
            url: "http://localhost:8080/user/subjects",
            withCredentials: true,
            method: "GET",
        }).then((response) => {
            var sch = [];
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
                    </p>
                </Modal.Body>
                <Modal.Footer>
                    <button type="button" className="accept-btn my-btn-white" onClick={props.onHide}>Storno</button>
                    <button type="button" className="removal-btn" onClick={() => {
                        props.onHide();
                        removeSubject();
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

    const addSubject = async (event) => {
        event.preventDefault();
        const response = await axios({
            url: `http://localhost:8080/coordinator/addSubject`,
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
            await getSubjects();
        }
    };

    useEffect(() => {
        getSubjects();
    }, []);

    if (checkRole()) return <Navigate to="/login"/>;
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
                                    <b className="center pb-4" style={{fontSize: "20px"}}>Název předmětu</b>
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
                        className="alert-practice-error m-4 p-4"
                    >
                        <BsExclamationTriangleFill className={"alert-icon-error"}/> {errorMsg}
                    </Alert>
                    <Alert
                        show={showSuccessAlert}
                        variant="success"
                        className="alert-practice-success m-4 p-4"
                    >
                        <BsCheckLg className={"alert-icon-success"}/> Předmět byl přidán
                    </Alert>
                </div>
                <div className="col p-3">
                    <h4 className="p-3">Seznam předmětů</h4>
                    <table className="table table-striped align-items-center">
                        <thead>
                        <tr>
                            <th scope="col">Předměty</th>
                        </tr>
                        </thead>
                        <tbody>
                        {!noSubjects &&
                        subjects.map((item, index) => (
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
            <hr/>
            {subjects.length > 0 &&
            <div className="customAlertContainer">
                <div className="w-75 p-2 m-3 center alertCustom">
                    <table className="table align-items-center">
                        <thead>
                        <tr>
                            <th scope="col">Praxe bez přiřazených předmětů</th>
                        </tr>
                        </thead>
                        <tbody>
                        {!noSubjects &&
                        subjects.map((item, index) => (
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
            </div>}
        </Container>
    );
};
export default AddSubjectComponent;
