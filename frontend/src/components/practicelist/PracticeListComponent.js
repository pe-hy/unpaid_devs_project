import Accordion from "react-bootstrap/Accordion";
import "./PracticeListComponent.css";
import axios from "axios";
import React from "react";
import { Container, Row, Col } from "react-bootstrap";

const baseURL = "http://localhost:8080/student";

export const PracticeListComponent = () => {
    const [practices, setPractices] = React.useState(null);
    React.useEffect(() => {
        axios.get(`${baseURL}/practices`).then((response) => {
            setPractices(response.data);
        });
    }, []);
    if (!practices) return null;
    return (
        <Container fluid>
            <Accordion>
                <Container fluid>
                    <Row>
                        <Col className="text-center">
                            <b>Předmět</b>
                        </Col>
                        <Col className="text-center">
                            <b>Jméno</b>
                        </Col>
                        <Col className="text-center">
                            <b>Škola</b>
                        </Col>
                        <Col className="text-center">
                            <b>Datum</b>
                        </Col>
                        <Col className="text-center">
                            <b>Čas</b>
                        </Col>
                        <Col className="text-center">
                            <b>E-mail</b>
                        </Col>
                        <Col className="text-center">
                            <b>Kapacita</b>
                        </Col>
                    </Row>
                </Container>
                {practices.map((item) => (
                    <Container fluid>
                        <Row className="accordion-row">
                                <Accordion.Item eventKey={item.id}>
                                    <Accordion.Header>
                                        <Container fluid>
                                            <Row className="align-items-center">
                                                <Col className="text-center">{item.subjectResponse.name}</Col>
                                                <Col className="text-center">{item.teacher.firstName + " " + item.teacher.secondName}</Col>
                                                <Col className="text-center">{item.teacher.schoolName}</Col>
                                                <Col className="text-center">{item.date}</Col>
                                                <Col className="text-center">{item.start + " - " + item.end}</Col>
                                                <Col className="text-center">{item.email}</Col>
                                                <Col className="text-center">{item.capacity}</Col>
                                            </Row>
                                        </Container>
                                    </Accordion.Header>
                                    <Accordion.Body>
                                        Informace k tomuto předmětu...
                                    </Accordion.Body>
                                </Accordion.Item>
                        </Row>
                    </Container>
                ))}
            </Accordion>
        </Container>
    );
};


export default PracticeListComponent;
