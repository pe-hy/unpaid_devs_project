import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
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
  Alert,
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
  const [showDangerAlert, setshowDangerAlert] = useState(false);
  const [showSuccessAlert, setshowSuccessAlert] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    setshowSuccessAlert(false);
    setFormData({ ...formData, [e.target.name]: e.target.value.trim() });
  };

  const getSubjects = async () => {
    if (checkRole()) return;
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
    console.log(formData);
    if (!formData["subjectId"]) {
      formData["subjectId"] = subjects.at(0).id;
    } else {
      subjects.forEach((element) => {
        if (element.name === formData["subjectId"]) {
          formData["subjectId"] = element.id;
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
    let start = formData["start"];
    let end = formData["end"];
    formData["time"] = { start: start, end: end };
  };

  const addPraxe = async (event) => {
    event.preventDefault();
    checkFormData(formData);
    console.log(formData);
    const response = await axios({
      url: `http://localhost:8080/teacher/practice`,
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
      clearForm();
    }
  };

  const clearForm = () => {
    document.getElementById("Form").reset();
  };

  const clearNotes = () => {
    document.getElementById("Poznamka").value = "";
  };

  const checkRole = () => {
    return localStorage.getItem("role") !== "ROLE_TEACHER";
  };

  if (checkRole()) return <Navigate to="/login" />;
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
                  max="10"
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
      <Alert
        show={showDangerAlert}
        variant="danger"
        className="w-25 mt-3 ml-3 "
      >
        {errorMsg}
      </Alert>
      <Alert
        show={showSuccessAlert}
        variant="success"
        className="w-25 mt-3 ml-3 "
      >
        Vytvoření proběhlo úspěšně
      </Alert>
    </Form>
  );
};

export default TabsForm;
