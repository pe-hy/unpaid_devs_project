import Accordion from "react-bootstrap/Accordion";
import "./AccordionStyles.css";

const list = [
  {
    eventKey: 0,
    subject: "Matematika aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    name: "Jan Nowak",
    school: "Gymnázium Hladnov",
    date: "27.11.2022",
    time: "10:45 - 11:30",
    email: "jan.nowak@osu.cz",
    button: "Rezervovat",
  },
  {
    eventKey: 1,
    subject: "Fyzika",
    name: "Jan Novák",
    school: "Gymnázium Hladnov",
    date: "28.11.2022",
    time: "11:45 - 12:30",
    email: "jan.novak@osu.cz",
    button: "Rezervovat",
  },
  {
    eventKey: 2,
    subject: "Čeština",
    name: "Jan Nový",
    school: "Gymnázium Hladnov",
    date: "04.12.2022",
    time: "09:45 - 10:30",
    email: "jan.novy@osu.cz",
    button: "Rezervovat",
  },
];

export const AccordionComponent = () => {
  return (
    <Accordion className="accordion-flush accordion-container">
      <div className="accordion-title-container even-spaced">
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
        <Accordion.Item
          key={item.eventKey}
          eventKey={item.eventKey}
          className="accordion-row-container even-spaced"
        >
          <div className="accordion-header-and-body">
            <Accordion.Header className="accordion-item-container">
              <div className="title-element-container">{item.subject}</div>
              <div className="title-element-container">{item.name}</div>
              <div className="title-element-container">{item.school}</div>
              <div className="title-element-container">{item.date}</div>
              <div className="title-element-container">{item.time}</div>
              <div className="title-element-container">{item.email}</div>
            </Accordion.Header>
            <Accordion.Body className="accordion-body">
              <p>Informace k tomuto předmětu...</p>
              <p>
                Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Nullam
                justo enim, consectetuer nec, ullamcorper ac, vestibulum in,
                elit. Nam libero tempore, cum soluta nobis est eligendi optio
                cumque nihil impedit quo minus id quod maxime placeat facere
                possimus, omnis voluptas assumenda est, omnis dolor repellendus.
                Fusce wisi.
              </p>
            </Accordion.Body>
          </div>
          <div className="button-container">
            <button className="button">{item.button}</button>
          </div>
        </Accordion.Item>
      ))}
    </Accordion>
  );
};

export default AccordionComponent;

{
  /* <Accordion className="accordion-flush">
      {list.map((item) => (
        
      ))}
    </Accordion> */
}

{
  /* <div key={item.eventKey} className="accordion-container">
          <Accordion.Item eventKey={item.eventKey}>
            <Accordion.Header>
              <div className="accordionTitleComponent">{item.subject}</div>
              <div className="accordionTitleComponent">{item.name}</div>
              <div className="accordionTitleComponent">{item.school}</div>
              <div className="accordionTitleComponent">{item.date}</div>
              <div className="accordionTitleComponent">{item.time}</div>
              <div className="accordionTitleComponent">{item.email}</div>
            </Accordion.Header>
            <Accordion.Body>
              <p>Informace k tomuto předmětu...</p>
              <p>
                Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Nullam
                justo enim, consectetuer nec, ullamcorper ac, vestibulum in,
                elit. Nam libero tempore, cum soluta nobis est eligendi optio
                cumque nihil impedit quo minus id quod maxime placeat facere
                possimus, omnis voluptas assumenda est, omnis dolor repellendus.
                Fusce wisi.
              </p>
            </Accordion.Body>
          </Accordion.Item>
          <div className="button-container">
            <button className="button center">{item.button}</button>
          </div>
        </div> */
}
