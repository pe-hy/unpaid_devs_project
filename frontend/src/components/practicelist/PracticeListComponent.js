import "./PracticeListComponent.css";
import Accordion from "react-bootstrap/Accordion";
import axios from "axios";
import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";

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
      <div style={{ width: "85%" }}>
        <div className="title-container">
          <Row style={{ width: "100%" }}>
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
        </div>
      </div>

      <Accordion flush>
        {practices.map((item) => (
          <Accordion.Item eventKey={item.id} style={{ display: "block" }}>
            <div style={{ display: "flex" }}>
              <Accordion.Header style={{ width: "85%" }}>
                <Row style={{ width: "100%" }}>
                  <Col className="text-center">{item.subjectResponse.name}</Col>
                  <Col className="text-center">
                    {item.teacher.firstName + " " + item.teacher.secondName}
                  </Col>
                  <Col className="text-center">{item.teacher.schoolName}</Col>
                  <Col className="text-center">{item.date}</Col>
                  <Col className="text-center">
                    {item.start + " - " + item.end}
                  </Col>
                  <Col className="text-center">{item.email}</Col>
                  <Col className="text-center">{item.capacity}</Col>
                </Row>
              </Accordion.Header>
              <div className="center" style={{ width: "15%" }}>
                <Button variant="outline-primary">Registrovat</Button>
              </div>
            </div>

            <Accordion.Body>Informace o předmětu...</Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
    </Container>
  );
};

export default PracticeListComponent;
