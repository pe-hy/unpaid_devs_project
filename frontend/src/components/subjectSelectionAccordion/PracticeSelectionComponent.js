import Accordion from "react-bootstrap/Accordion";
import { Container, Row, Col } from "react-bootstrap";
import "./PracticeSelectionStyles.css";

const list = [
  {
    eventKey: 0,
    subject: "Matematika",
    name: "Jan Nowak",
    school: "Gymnázium Hladnov",
    date: "27.11.2022",
    time: "10:45 - 11:30",
    email: "jan.nowak@seznam.cz",
    capacity: "0/2",
    button: "rezervovat",
  },
  {
    eventKey: 1,
    subject: "Fyzika",
    name: "Jan Novák",
    school: "Gymnázium Hladnov",
    date: "28.11.2022",
    time: "11:45 - 12:30",
    email: "jan.novak@volny.cz",
    capacity: "1/2",
    button: "rezervovat",
  },
  {
    eventKey: 2,
    subject: "Čeština",
    name: "Jan Nový",
    school: "Gymnázium Hladnov",
    date: "04.12.2022",
    time: "09:45 - 10:30",
    email: "jan.novy@gmail.com",
    capacity: "2/3",
    button: "rezervovat",
  },
];

export const PracticeSelectionComponent = () => {
  return (
    <Container fluid>
      <Accordion>
        <Container fluid>
          <Row xs={1} md={4} lg={7}>
            <Col>
              <b>Předmět</b>
            </Col>
            <Col>
              <b>Jméno</b>
            </Col>
            <Col>
              <b>Škola</b>
            </Col>
            <Col>
              <b>Datum</b>
            </Col>
            <Col>
              <b>Čas</b>
            </Col>
            <Col>
              <b>E-mail</b>
            </Col>
            <Col>
              <b>Kapacita</b>
            </Col>
          </Row>
        </Container>
        {list.map((item) => (
          <Container fluid>
            <Row className="accordion-row">
              <Col>
                <Accordion.Item eventKey={item.eventKey}>
                  <Accordion.Header>
                    <Container fluid>
                      <Row xs={1} md={4} lg={7}>
                        <Col>{item.subject}</Col>
                        <Col>{item.name}</Col>
                        <Col>{item.school}</Col>
                        <Col>{item.date}</Col>
                        <Col>{item.time}</Col>
                        <Col>{item.email}</Col>
                        <Col>{item.capacity}</Col>
                      </Row>
                    </Container>
                  </Accordion.Header>
                  <Accordion.Body>
                    Informace k tomuto předmětu...
                  </Accordion.Body>
                </Accordion.Item>
              </Col>
              <Col md="auto">
                <button type="button" className="btn btn-primary">
                  {item.button}
                </button>
              </Col>
            </Row>
          </Container>
        ))}
      </Accordion>
    </Container>
  );
};

export default PracticeSelectionComponent;
