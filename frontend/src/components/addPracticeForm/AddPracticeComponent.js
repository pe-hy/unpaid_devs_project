import React, { useEffect, useState } from "react";
import {
  Col,
  Row,
  Form,
  InputGroup,
  OverlayTrigger,
  Tooltip,
  ButtonGroup,
  Button,
  ButtonToolbar,
} from "react-bootstrap";

import "./TabsStyles.css";

import { axios } from "../../axios";

export function getMinDate(days) {
  let date = new Date();
  date.setDate(date.getDate() + days);
  return date;
}

const TabsForm = () => {
  const [subjects, setSubjects] = useState([]);
  const [formData, setFormData] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value.trim() });
  };

  const getSubjects = async () => {
    const response = await axios({
      url: "http://localhost:8080/user/subjects",
      withCredentials: true,
      method: "GET",
    }).catch((err) => {
      alert(err.response.data.message);
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
    if (!formData["subjectId"]) {
      formData["subjectId"] = subjects.at(0).id;
    } else {
      subjects.forEach((element) => {
        if (element.name === formData["subjectId"]) {
          formData["subjectId"] = element.id;
        }
      });
    }
  };

  const addPraxe = async (event) => {
    event.preventDefault();
    checkFormData(formData);
    const response = await axios({
      url: `/teacher/practice`,
      withCredentials: true,
      method: "POST",
      data: formData,
    }).catch((err) => {
      alert(err.response.data.message);
      console.log(err.response.data.message);
    });
    if (response) {
      clearForm();
    }
  };

  const clearForm = () => {
    document.getElementById("Form").reset();
  };

  const clearNotes = () => {
    document.getElementById("Poznamka").value = "";
  };

  return (
    <Form onSubmit={addPraxe} id="Form">
      <Row>
        <Col sm={4}>
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
                  name="subjectId"
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
            <OverlayTrigger
              key={"top"}
              placement={"top"}
              overlay={
                <Tooltip id={"tooltip-top"}>
                  Maximální počet studentů na praxi
                </Tooltip>
              }
            >
              <Col sm={3}>Kapacita</Col>
            </OverlayTrigger>
            <Col sm={8}>
              <InputGroup>
                <Form.Control
                  name="capacity"
                  type="number"
                  min="1"
                  defaultValue="1"
                  required="required"
                  onChange={handleChange}
                />
              </InputGroup>
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="m-3">
            <Col sm={3}></Col>
            <Col sm={8}>
              <ButtonGroup className="d-flex">
                <Button type="submit">Přidat</Button>
              </ButtonGroup>
            </Col>
          </Form.Group>
        </Col>
        <Col sm={4}>
          <Form.Group className="m-3" role="form">
            <Form.Control
              name="note"
              id="Poznamka"
              size="lg"
              as="textarea"
              rows={7}
              placeholder={"Poznámka"}
              onChange={handleChange}
            />
          </Form.Group>
          <ButtonToolbar className="justify-content-end">
            <Button className="m-2" onClick={clearNotes} size="md">
              {" "}
              Zrušit{" "}
            </Button>
            <Button className="m-2" size="md">
              {" "}
              Uložit{" "}
            </Button>
          </ButtonToolbar>
        </Col>
        <Col sm={2}> </Col>
      </Row>
    </Form>
  );
};

export default TabsForm;
