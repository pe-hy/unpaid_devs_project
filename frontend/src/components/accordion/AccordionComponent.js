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
    email: "jan.novak@osu.cz",
    button: "rezervovat",
  },
  {
    eventKey: 1,
    subject: "Matematika",
    name: "Jan Nowak",
    school: "Gymnázium Hladnov",
    date: "27.11.2022",
    time: "10:45 - 11:30",
    email: "jan.novak@osu.cz",
    button: "rezervovat",
  },
  {
    eventKey: 2,
    subject: "Matematika",
    name: "Jan Nowak",
    school: "Gymnázium Hladnov",
    date: "27.11.2022",
    time: "10:45 - 11:30",
    email: "jan.novak@osu.cz",
    button: "rezervovat",
  },
];

export const AccordionComponent = () => {
  return (
    <Accordion className="accordion">
      {list.map((item) => (
        <Accordion.Item eventKey={item.eventKey}>
          <Accordion.Header>
            <div className="accordionTitleComponent">{item.subject}</div>
            <div className="accordionTitleComponent">{item.name}</div>
            <div className="accordionTitleComponent">{item.school}</div>
            <div className="accordionTitleComponent">{item.date}</div>
            <div className="accordionTitleComponent">{item.time}</div>
            <div className="accordionTitleComponent">{item.email}</div>
            <div className="accordionTitleComponent">
              <button>{item.button}</button>
            </div>
          </Accordion.Header>
          <Accordion.Body>content</Accordion.Body>
        </Accordion.Item>
      ))}
    </Accordion>
  );
};

export default AccordionComponent;
