import Accordion from "react-bootstrap/Accordion";
import "./AccordionStyles.css";

const list = [
  {
    eventKey: 0,
    subject: "Matematika",
    name: "Jan Nowak",
    school: "Gymnázium Hladnov",
    date: "27.11.2022",
    time: "10:45 - 11:30",
    email: "jan.nowak@seznam.cz",
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
    button: "rezervovat",
  },
];

export const AccordionComponent = () => {
  return (
    <Accordion className="accordion-flush">
      <div className="accordion-title-container">
        <div className="accordion-item-container">
          <div className="title-element-container">
            <b>Předmět</b>
          </div>
          <div className="title-element-container">
            <b>Jméno</b>
          </div>
          <div className="title-element-container">
            <b>Škola</b>
          </div>
          <div className="title-element-container">
            <b>Datum</b>
          </div>
          <div className="title-element-container">
            <b>Čas</b>
          </div>
          <div className="title-element-container">
            <b>E-mail</b>
          </div>
        </div>
      </div>
      {list.map((item) => (
        <div key={item.eventKey} className="accordion-container">
          <Accordion.Item eventKey={item.eventKey}>
            <Accordion.Header>
              <div className="accordionTitleComponent">{item.subject}</div>
              <div className="accordionTitleComponent">{item.name}</div>
              <div className="accordionTitleComponent">{item.school}</div>
              <div className="accordionTitleComponent">{item.date}</div>
              <div className="accordionTitleComponent">{item.time}</div>
              <div className="accordionTitleComponent">{item.email}</div>
            </Accordion.Header>
            <Accordion.Body>Informace k tomuto předmětu...</Accordion.Body>
          </Accordion.Item>
          <div className="button-container">
            <button className="button center">{item.button}</button>
          </div>
        </div>
      ))}
    </Accordion>
  );
};

export default AccordionComponent;
