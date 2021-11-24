import React, {useEffect, useState} from 'react';
import {
    Tab,
    Tabs,
    Container,
    Col,
    Row,
    Form,
    InputGroup,
    OverlayTrigger,
    Tooltip,
    ButtonGroup,
    Button, ButtonToolbar, Table
} from "react-bootstrap";

import '../styles/tabs.css';

import {axios} from "../axios";
import {Prax} from "./prax";
import {Probehle} from "./probehle";

const TabsForm = () => {
    const [praxe, setPraxe] = useState([]);
    const [formData, setFormData] = useState({});

    const noPraxe = !praxe || (praxe && praxe.length === 0);

    const getDatum = () => {
        return new Date().toISOString().slice(0,10);
    }

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value.trim(),
        });
    };

    const getPraxe = async () => {
        const response = await axios.get("/praxe").catch((err) => {
            console.log("Error:", err);
        });
        if (response && response.data) {
            setPraxe(response.data);
        }
    };

    const addPraxe = async (event) => {
        event.preventDefault();
        console.log(formData);
        const response = await axios.post("/praxe", formData).catch((error) => {
            console.log("Error: ", error)});
        if (response) await getPraxe();
        setFormData({})
        clearForm();
    };

    const deletePraxe = async (id) => {
        const response = await axios.delete(`/praxe/${id}`).catch((err) => {
            console.log("Error deleting: ", err);
        });

        if (response) await getPraxe();
    };

    const clearForm = () => {
        document.getElementById("Form").reset();
    }

    const clearNotes = () => {
        document.getElementById("Poznamka").value = "";
    }

    useEffect(() => {
        getPraxe();
    }, []);

    const probehle = praxe.filter(prax => Date.parse(prax.datum) < Date.parse(getDatum()));
    const vypsane = praxe.filter(prax => Date.parse(prax.datum) >= Date.parse(getDatum()));


    return (
        <Container className={"m-3"} fluid>
            <Tabs defaultActiveKey="home" id="tab" >
                <Tab eventKey="home" title="Přidání praxe">
                    <Form onSubmit={addPraxe} id="Form">
                        <Row>
                            <Col sm={4}>
                                <Form.Group as={Row} className="m-3" controlId="formHorizontalDatum" role="form">
                                    <Col sm={3}>
                                        Datum
                                    </Col>
                                    <Col sm={8}>
                                        <InputGroup>
                                            <Form.Control name="datum" type="date" required="required" onChange={handleChange} />
                                        </InputGroup>
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row} className="m-3" controlId="formHorizontalTimeFrom" role="form">
                                    <Col sm={3}>
                                        Čas (od)
                                    </Col>
                                    <Col sm={8}>
                                        <InputGroup>
                                            <Form.Control name="start" type="time" required="required" onChange={handleChange} />
                                        </InputGroup>
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row} className="m-3" controlId="formHorizontalTimeTo" role="form">
                                    <Col sm={3}>
                                        Čas (do)
                                    </Col>
                                    <Col sm={8}>
                                        <InputGroup>
                                            <Form.Control name="end" type="time" required="required" onChange={handleChange}/>
                                        </InputGroup>
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row} className="m-3" controlId="formHorizontalSubject" role="form">
                                    <Col sm={3}>
                                        Předmět
                                    </Col>
                                    <Col sm={8}>
                                        <InputGroup>
                                            <Form.Select name="subject" required="required" onChange={handleChange}>
                                                <option> Matematika </option>
                                                <option> Fyzika </option>
                                                <option> Biologie </option>
                                            </Form.Select>
                                        </InputGroup>
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row} className="m-3" controlId="formHorizontalSubject" role="form">
                                    <OverlayTrigger
                                        key={'top'}
                                        placement={'top'}
                                        overlay={
                                            <Tooltip id={'tooltip-top'}>
                                                Maximální počet studentů na praxi
                                            </Tooltip>
                                        }
                                    >
                                        <Col sm={3}>
                                            Kapacita
                                        </Col>
                                    </OverlayTrigger>
                                    <Col sm={8}>
                                        <InputGroup>
                                            <Form.Control name="cap" type="number" min="1" required="required" onChange={handleChange}/>
                                        </InputGroup>
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row} className="m-3">
                                    <Col sm={3}>
                                    </Col>
                                    <Col sm={8} >
                                        <ButtonGroup className="d-flex">
                                            <Button type="submit">Přidat</Button>
                                        </ButtonGroup>
                                    </Col>
                                </Form.Group>

                            </Col>
                            <Col sm={4}>
                                <Form.Group className="m-3" role="form">
                                    <Form.Control name="notes" id="Poznamka" size="lg" as="textarea" rows={7} placeholder={"Poznámka"} onChange={handleChange}/>
                                </Form.Group>
                                <ButtonToolbar className="justify-content-end">
                                    <Button className="m-2" onClick={clearNotes} size="md"> Zrušit </Button>
                                    <Button className="m-2" size="md"> Uložit </Button>
                                </ButtonToolbar>
                            </Col>
                            <Col sm={2}> </Col>
                        </Row>
                    </Form>
                </Tab>
                <Tab id="vypsana" eventKey="vypsana" title="Vypsané praxe" >
                    <Container>
                        <Table striped bordered hover>
                            <thead>
                            <tr>
                                <th>Id</th>
                                <th>Datum</th>
                                <th>Čas (od)</th>
                                <th>Čas (od)</th>
                                <th>Předmět</th>
                                <th>Kapacita</th>
                                <th>Poznámka</th>
                                <th>Akce</th>
                            </tr>
                            </thead>
                            <tbody>
                            {!noPraxe && vypsane.map((prax, index) => (
                                <Prax key={index} {...prax} onDelete={deletePraxe}/>
                            ))}
                            </tbody>
                        </Table>
                    </Container>
                </Tab>
                <Tab eventKey="probehla" title="Proběhlé praxe" >
                    <Container>
                        <Table striped bordered hover>
                            <thead>
                            <tr>
                                <th>Id</th>
                                <th>Datum</th>
                                <th>Čas (od)</th>
                                <th>Čas (od)</th>
                                <th>Předmět</th>
                                <th>Kapacita</th>
                                <th>Poznámka</th>
                            </tr>
                            </thead>
                            <tbody>
                            {!noPraxe && probehle.map((prax, index) => (
                                <Probehle key={index} {...prax}/>
                            ))}
                            </tbody>
                        </Table>
                    </Container>
                </Tab>
            </Tabs>
        </Container>
    )
}

export default TabsForm;