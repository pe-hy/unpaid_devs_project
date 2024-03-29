import React, { useEffect, useState } from "react";
import { Alert, Button, ButtonGroup, Col, Form, InputGroup, OverlayTrigger, Row, Tooltip } from "react-bootstrap";
import { BsCheckLg, BsExclamationTriangleFill, BsFillPencilFill, BsInfoCircleFill } from "react-icons/bs";
import { Navigate } from "react-router-dom";
import { axios } from "../../../axios";
import "./TabsStyles.css";
import { useDispatch } from 'react-redux';
import { addTodo } from '../../../redux/todoSlice.js';

const URL = `${process.env.REACT_APP_AXIOS_URL}`;

const GET_SUBJECTS_URL = `${URL}/user/subjects`;
const GET_PRACTICES_URL = `${URL}/teacher/practice`;

export function getMinDate(days) {
    let date = new Date();
    date.setDate(date.getDate() + days);
    return date;
}

const TabsForm = () => {
    const [subjects, setSubjects] = useState([]);
    const [formData, setFormData] = useState({});
    const [showDangerAlert, setshowDangerAlert] = useState(false);
    const [showSuccessAlert, setshowSuccessAlert] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [noteLen, setNoteLen] = useState(0);

    const dispatch = useDispatch();

    const onSubmit = (id) => {
        dispatch(
            addTodo({
                title: id,
            })
        );
    };

    const handleChange = (e) => {
        setshowSuccessAlert(false);
        setFormData({ ...formData, [e.target.name]: e.target.value.trim() });
    };

    const handleTyping = (e) => {
        setNoteLen(e.target.value.length);
    };

    const getSubjects = async () => {
        if (checkRole()) return;
        const response = await axios({
            url: GET_SUBJECTS_URL,
            withCredentials: true,
            method: "GET",
        }).catch((err) => {
            console.log(err.response.data.message);
        });
        if (response && response.data) {
            setSubjects(response.data);
        }
    };

    useEffect(() => {
        getSubjects();
    }, []);

    const checkFormData = () => {
        if (!formData["subject"]) {
            formData["subject"] = { id: subjects.at(0).id, name: subjects.at(0).name };
        } else {
            subjects.forEach((element) => {
                if (element.name === formData["subject"]) {
                    formData["subject"] = { id: element.id, name: element.name };
                }
            });
        }
        if (!formData["date"]) {
            formData["date"] = new Date(new Date().setDate(new Date().getDate() + 7))
                .toISOString()
                .substr(0, 10);
        }
        if (!formData["capacity"]) {
            formData["capacity"] = 1;
        }
    };

    const addPraxe = async (event) => {
        event.preventDefault();
        checkFormData(formData);
        const response = await axios({
            url: GET_PRACTICES_URL,
            withCredentials: true,
            method: "POST",
            data: formData,
        }).catch((err) => {
            let error = err.response.data[0];
            setErrorMsg(
                typeof error !== "undefined"
                    ? error["message"]
                    : err.response.data["message"]
            );
            setshowSuccessAlert(false);
            setshowDangerAlert(true);
            console.log(err.response.data);
        });
        if (response) {
            setshowDangerAlert(false);
            setshowSuccessAlert(true);
            onSubmit(response.data);
            if (document.getElementById("tab-tab-tab1")) {
                document.getElementById("tab-tab-tab1").click();
                let observer = new MutationObserver((mutations) => {
                    mutations.forEach((mutation) => {
                        if (!mutation.addedNodes) return


                        document.getElementById("teacher-listed" + response.data).scrollIntoView();
                        observer.disconnect();

                    })
                })
                observer.observe(document.body, {
                    childList: true
                    , subtree: true
                    , attributes: false
                    , characterData: false
                })
            }

        }
    };

    const checkRole = () => {
        return localStorage.getItem("role") !== "ROLE_TEACHER";
    };

    if (checkRole()) return <Navigate to="/login" />;
    return (
        <Form onSubmit={addPraxe} id="Form">
            <Row>
                <Col sm={5} className={"cols"}>
                    <Form.Group
                        as={Row}
                        className="m-3"
                        controlId="formHorizontalDatum"
                        role="form"
                    >
                        <Col sm={3}>Datum</Col>
                        <Col sm={8}>
                            <InputGroup>
                                <Form.Control
                                    className={"custom-calendar"}
                                    name="date"
                                    type="date"
                                    min={new Date(new Date().setDate(new Date().getDate() + 7))
                                        .toISOString()
                                        .substr(0, 10)}
                                    max={new Date(new Date().setDate(new Date().getDate() + 365))
                                        .toISOString()
                                        .substr(0, 10)}
                                    defaultValue={new Date(
                                        new Date().setDate(new Date().getDate() + 7)
                                    )
                                        .toISOString()
                                        .substr(0, 10)}
                                    required="required"
                                    onChange={handleChange}
                                />
                            </InputGroup>
                        </Col>
                    </Form.Group>

                    <Form.Group
                        as={Row}
                        className="m-3"
                        controlId="formHorizontalTimeFrom"
                        role="form"
                    >
                        <Col sm={3}>Čas (od)</Col>
                        <Col sm={8}>
                            <InputGroup>
                                <Form.Control
                                    name="start"
                                    type="time"
                                    required="required"
                                    onChange={handleChange}
                                />
                            </InputGroup>
                        </Col>
                    </Form.Group>

                    <Form.Group
                        as={Row}
                        className="m-3"
                        controlId="formHorizontalTimeTo"
                        role="form"
                    >
                        <Col sm={3}>Čas (do)</Col>
                        <Col sm={8}>
                            <InputGroup>
                                <Form.Control
                                    name="end"
                                    type="time"
                                    required="required"
                                    onChange={handleChange}
                                />
                            </InputGroup>
                        </Col>
                    </Form.Group>

                    <Form.Group
                        as={Row}
                        className="m-3"
                        controlId="formHorizontalSubject"
                        role="form"
                    >
                        <Col sm={3}>Předmět</Col>
                        <Col sm={8}>
                            <InputGroup>
                                <Form.Select
                                    name="subject"
                                    required="required"
                                    onChange={handleChange}
                                >
                                    {subjects.map((item, index) => (
                                        <option key={item.id}> {item.name} </option>
                                    ))}
                                </Form.Select>
                            </InputGroup>
                        </Col>
                    </Form.Group>

                    <Form.Group
                        as={Row}
                        className="m-3"
                        controlId="formHorizontalSubject"
                        role="form"
                    >
                        <Col sm={3}>
                            <OverlayTrigger
                                overlay={
                                    <Tooltip>
                                        Maximální počet studentů na praxi.
                                    </Tooltip>
                                }
                            >
                                <span>
                                    <BsInfoCircleFill className={"info-tooltip mb-1"} />
                                </span>
                            </OverlayTrigger>
                            Kapacita</Col>
                        <Col sm={8}>
                            <InputGroup>
                                <Form.Control
                                    name="capacity"
                                    type="number"
                                    min="1"
                                    max="10"
                                    defaultValue="1"
                                    required="required"
                                    onChange={handleChange}
                                />
                            </InputGroup>
                        </Col>
                    </Form.Group>
                </Col>
                <Col sm={5} className={"p-padding"}>
                    <Form.Group className="m-4" role="form">
                        <p className={"p-padding"}><BsFillPencilFill className={"info-tooltip"} />{noteLen}/250</p>
                        <Form.Control
                            name="note"
                            id="Poznamka"
                            size="lg"
                            maxLength="250"
                            as="textarea"
                            rows={7}
                            placeholder={"Poznámka"}
                            onChange={(e) => {
                                handleChange(e);
                                handleTyping(e);
                            }}
                        />
                    </Form.Group>
                </Col>
                <Col sm={2}> </Col>
            </Row>

            <Col sm={5} className={"cols-submit"}>
                <Form.Group as={Row} className="m-3">
                    <Col sm={3}></Col>
                    <Col sm={8}>
                        <ButtonGroup className="d-flex button-padding">
                            <Button type="submit" className={"button-add"}>Přidat</Button>
                        </ButtonGroup>
                    </Col>
                </Form.Group>
            </Col>
            <div className={"my-row"}>
                <Alert
                    show={showDangerAlert}
                    variant="danger"
                    className="alert-practice-error"
                >
                    <BsExclamationTriangleFill className={"alert-icon-error"} /> {errorMsg}
                </Alert>
            </div>
        </Form>
    );
};

export default TabsForm;
