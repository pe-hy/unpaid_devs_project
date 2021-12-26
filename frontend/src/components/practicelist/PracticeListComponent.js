import "./PracticeListComponent.css";
import Accordion from "react-bootstrap/Accordion";
import React, {useEffect, useState} from "react";
import {Col, Container, OverlayTrigger, Row, Tooltip} from "react-bootstrap";
import {axios} from "../../axios.js";
import {BsInfoCircleFill} from "react-icons/bs";
import ReservationButtonComponent from "../reservationButton/ReservationButtonComponent";
import Badge from "react-bootstrap/Badge";
import UnReservationButtonComponent from "../reservationButton/UnReservationButtonComponent";
import {Navigate} from "react-router-dom";

export const PracticeListComponent = () => {
    const [practices, setPraxe] = useState([]);
    const noPractices = !practices || (practices && practices.length === 0);
    const reservation = "Rezervovat";
    const unReservation = "Odrezervovat";

    const getPraxe = async () => {
        if (checkRole()) return;
        const response = await axios({
            url: "http://localhost:8080/student/practices-list",
            withCredentials: true,
            method: "GET",
        }).catch((err) => {
            alert(err.response.data.message);
            console.log(err.response.data.message);
        });
        if (response && response.data) {
            console.log(response);
            setPraxe(response.data);
        }
    };

    useEffect(() => {
        getPraxe();
    }, []);

    const registerRequest = async (id) => {
        const response = await axios({
            url: `student/practices/${id}/make-reservation`,
            withCredentials: true,
            method: "PUT",
        }).catch((err) => {
            alert(err.response.data.message);
            console.log(err.response.data.message);
        });
        if (response && response.data) {
            console.log(response);
            setPraxe(response.data);
        }
        await getPraxe();
    };

    const unRegisterRequest = async (id) => {
        const response = await axios({
            url: `student/practices/${id}/cancel-reservation`,
            withCredentials: true,
            method: "PUT",
        }).catch((err) => {
            alert(err.response.data.message);
            console.log(err.response.data.message);
        });
        if (response && response.data) {
            console.log(response);
            setPraxe(response.data);
        }
        await getPraxe();
    };

    const checkRole = () => {
        return localStorage.getItem("role") !== "ROLE_STUDENT";
    };

    const getButton = (isReserved, id) => {
        if (!isReserved) {
            return (
                <ReservationButtonComponent
                    text={reservation}
                    onClick={() => registerRequest(id)}
                />
            );
        } else {
            return (
                <UnReservationButtonComponent
                    text={unReservation}
                    onClick={() => unRegisterRequest(id)}
                />
            );
        }
    };
    if (checkRole()) return <Navigate to="/login"/>;
    return (
        <Container fluid>
            <Accordion>
                <div style={{width: "85%"}}>
                    <div className="title-container text-info-practice">
                        <Row style={{width: "100%"}}>
                            <Col className="text-center">
                                <b>Předmět</b>
                            </Col>
                            <Col className="text-center d-none">
                                <b>Učitel</b>
                            </Col>
                            <Col className="text-center d-none d-xl-block">
                                <b>Škola</b>
                            </Col>
                            <Col className="text-center">
                                <b>Datum</b>
                            </Col>
                            <Col className="text-center d-none">
                                <b>Čas</b>
                            </Col>
                            <Col className="text-center d-none">
                                <b>E-mail</b>
                            </Col>
                            <Col className="text-center d-none">
                                <b>Kapacita</b>
                                <OverlayTrigger
                                    overlay={
                                        <Tooltip>
                                            Počet aktuálně zapsaných studentů / maximální počet
                                            studentů na praxi.
                                        </Tooltip>
                                    }
                                >
                  <span>
                    <BsInfoCircleFill className={"info-tooltip"}/>
                  </span>
                                </OverlayTrigger>
                            </Col>
                        </Row>
                    </div>
                </div>
                {!noPractices &&
                practices.map((item, index) => (
                    <Accordion.Item
                        eventKey={item.id}
                        key={index}
                        style={{display: "block"}}
                    >
                        <div style={{display: "flex"}}>
                            <Accordion.Header className={"accordion-header"}>
                                <Row style={{width: "100%"}}>
                                    <Col className="text-center  ">{item.subject.name}</Col>
                                    <Col className="text-center d-none">
                                        {item.teacher.firstName + " " + item.teacher.secondName}
                                    </Col>
                                    <Col className="text-center d-none d-xl-block">{item.teacher.school.name}</Col>
                                    <Col className="text-center">
                                        {item.date.split("-")[2] +
                                        ". " +
                                        item.date.split("-")[1] +
                                        ". " +
                                        item.date.split("-")[0]}
                                    </Col>
                                    <Col className="text-center d-none">
                                        {item.start.split(":")[0] +
                                        ":" +
                                        item.start.split(":")[1] +
                                        " - " +
                                        item.end.split(":")[0] +
                                        ":" +
                                        item.end.split(":")[1]}
                                    </Col>
                                    <Col className="text-center d-none">
                                        {item.teacher.username}
                                    </Col>
                                    <Col className="text-center badge d-none">
                                        <div>
                                            <Badge
                                                bg={
                                                    item.numberOfReservedStudents < item.capacity - 1
                                                        ? "success"
                                                        : "danger"
                                                }
                                            >
                                                {item.numberOfReservedStudents} / {item.capacity}
                                            </Badge>
                                        </div>
                                    </Col>
                                </Row>
                            </Accordion.Header>
                            <div className="center d-none d-xl-block" style={{width: "15%"}}>
                                {getButton(item.isCurrentStudentReserved, item.id)}
                            </div>
                        </div>

                        <Accordion.Body>
                            <div>
                                <hr/>
                                <div style={{marginLeft: "50px"}}>
                                    <p><b>Učitel:</b> {item.teacher.firstName + " " + item.teacher.secondName}</p>
                                    <p><b>E-mail:</b> {item.teacher.username}</p>
                                    <p><b>Čas: </b>
                                    <span>
                    {item.start.split(":")[0] +
                    ":" +
                    item.start.split(":")[1] +
                    " - " +
                    item.end.split(":")[0] +
                    ":" +
                    item.end.split(":")[1]}</span></p>

                                    <b>Kapacita: </b>
                                    <span>
                      <Badge
                          bg={
                              item.numberOfReservedStudents < item.capacity - 1
                                  ? "success"
                                  : "danger"
                          }
                      >
                        {item.numberOfReservedStudents} / {item.capacity}
                      </Badge>
                    </span>

                                    <p style={{marginTop: "10px"}}><i>Poznámka:</i> {item.note}</p>

                                <div className="center d-xl-none" style={{width: "15%"}}>
                                    {getButton(item.isCurrentStudentReserved, item.id)}
                                </div>

                                </div>
                            </div>
                        </Accordion.Body>
                    </Accordion.Item>
                ))}
            </Accordion>
        </Container>
    );
};

export default PracticeListComponent;
