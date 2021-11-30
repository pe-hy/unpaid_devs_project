import "./PracticeListComponent.css";
import Accordion from "react-bootstrap/Accordion";
import React, { useEffect, useState } from "react";
import {Container, Row, Col, OverlayTrigger, Tooltip} from "react-bootstrap";
import { axios } from "../../axios.js";
import {BsInfoCircleFill} from "react-icons/bs";
import ReservationButtonComponent from "../reservationButton/ReservationButtonComponent";

export const PracticeListComponent = () => {
  const [practices, setPraxe] = useState([]);
  const noPractices = !practices || (practices && practices.length === 0);
  const reservation = "Rezervovat";

  const getPraxe = async () => {
    const response = await axios.get("/student/practices").catch((err) => {
      console.log("Error:", err);
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
    const response = await axios
      .put(`student/practice/${id}/make-reservation`)
      .catch((err) => {
        alert(err.response.data.message);
        console.log(err.response.data.message)
      });
    if (response && response.data) {
      console.log(response);
      setPraxe(response.data);
    }
    await getPraxe();
  };

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
              <OverlayTrigger overlay={<Tooltip>Počet aktuálně zapsaných studentů / maximální počet studentů na praxi.</Tooltip>}>
                <span>
                  <BsInfoCircleFill className={"iconStyles"} />
                </span>
              </OverlayTrigger>
            </Col>
          </Row>
        </div>
      </div>

      <Accordion flush>
        {!noPractices &&
          practices.map((item, index) => (
            <Accordion.Item
              eventKey={item.id}
              key={index}
              style={{ display: "block" }}
            >
              <div style={{ display: "flex" }}>
                <Accordion.Header style={{ width: "85%" }}>
                  <Row style={{ width: "100%" }}>
                    <Col className="text-center">{item.subjectInfo.name}</Col>
                    <Col className="text-center">
                      {item.teacher.firstName + " " + item.teacher.secondName}
                    </Col>
                    <Col className="text-center">{item.teacher.schoolName}</Col>
                    <Col className="text-center">{item.date.split("-")[2] + ". " + item.date.split("-")[1] + ". " + item.date.split("-")[0]}</Col>
                    <Col className="text-center">
                      {item.start.split(":")[0] + ":" + item.start.split(":")[1] + " - " + item.end.split(":")[0] + ":" + item.end.split(":")[1]}
                    </Col>
                    <Col className="text-center">{item.teacher.username}</Col>
                    <Col className="text-center">{item.registeredCount}  /  {item.capacity}</Col>
                  </Row>
                </Accordion.Header>
                <div className="center" style={{ width: "15%" }}>
                  <ReservationButtonComponent
                    text={reservation}
                    color={"white"}
                    onClick={() => registerRequest(item.id)}
                  />
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
