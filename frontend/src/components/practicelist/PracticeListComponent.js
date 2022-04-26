import "./PracticeListComponent.css";
import Accordion from "react-bootstrap/Accordion";
import React, {useEffect, useState} from "react";
import {Col, Container, OverlayTrigger, Row, Tooltip} from "react-bootstrap";
import {axios} from "../../axios.js";
import {BsInfoCircleFill, BsSearch} from "react-icons/bs";
import ReservationButtonComponent from "../reservationButton/ReservationButtonComponent";
import Badge from "react-bootstrap/Badge";
import UnReservationButtonComponent from "../reservationButton/UnReservationButtonComponent";
import {Navigate} from "react-router-dom";
import Combobox from "react-widgets/Combobox";
import "react-widgets/styles.css";
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import * as rdrLocales from 'react-date-range/dist/locale';
import {DateRange} from 'react-date-range';
import {CSSTransition, TransitionGroup} from 'react-transition-group';

export const PracticeListComponent = () => {
        let iconStyles = {fontSize: "1.5em", marginRight: "5px"};
        const duration = 250;
        const [inProp, setInProp] = useState(false);
        const [showing, setShowing] = useState(false);
        const [practices, setPraxe] = useState([]);
        const noPractices = !practices || (practices && practices.length === 0);
        const reservation = "Rezervovat";
        const unReservation = "Odrezervovat";
        const [q, setQ] = useState("");
        const [searchParam] = useState(["name"]);
        const [filterParam, setFilterParam] = useState(["All"]);
        const [schools, setSchools] = useState([]);
        const [selectedSchool, setSelectedSchools] = useState("");
        const [btnText, setBtnText] = useState("Zobrazit možnosti vyhledávání");

        const changeBtnText = () => {
            if (!showing) {
                setBtnText("Schovat možnosti vyhledávání");
            } else {
                setBtnText("Zobrazit možnosti vyhledávání");
            }
        }

        const [state, setState] = useState([
            {
                startDate: new Date(),
                endDate: new Date(),
                key: 'selection'
            }
        ]);

        const getPraxe = async () => {
            if (checkRole()) return;
            const response = await axios({
                url: "http://localhost:8080/student/practices-list",
                withCredentials: true,
                method: "GET",
            }).catch((err) => {
                alert(err.response.data.message);
                console.log(err.response.data.message);
            });
            if (response && response.data) {
                console.log(response);
                setPraxe(response.data);
            }
        };

        useEffect(() => {
            getPraxe();
            getSchools();
        }, []);


        function search(items) {
            console.log("schools", schools);
            console.log("items", items);
            return items.filter((item) => {
                /*
                // in here we check if our region is equal to our c state
                // if it's equal to then only return the items that match
                // if not return All the countries
                */
                if (item.teacher.school.name == filterParam) {
                    return searchParam.some((newItem) => {
                        console.log("what is this", newItem);
                        return (
                            item.teacher.school[newItem]
                                .toString()
                                .toLowerCase()
                                .indexOf(q.toLowerCase()) > -1
                        );
                    });
                } else if (filterParam == "All") {
                    return searchParam.some((newItem) => {
                        console.log("what is this", newItem);
                        return (
                            item.teacher.school[newItem]
                                .toString()
                                .toLowerCase()
                                .indexOf(q.toLowerCase()) > -1
                        );
                    });
                }
            });
        }

        const registerRequest = async (id) => {
            const response = await axios({
                url: `student/practices/${id}/make-reservation`,
                withCredentials: true,
                method: "PUT",
            }).catch((err) => {
                alert(err.response.data.message);
                console.log(err.response.data.message);
            });
            if (response && response.data) {
                console.log(response);
                setPraxe(response.data);
            }
            await getPraxe();
        };

        const unRegisterRequest = async (id) => {
            const response = await axios({
                url: `student/practices/${id}/cancel-reservation`,
                withCredentials: true,
                method: "PUT",
            }).catch((err) => {
                alert(err.response.data.message);
                console.log(err.response.data.message);
            });
            if (response && response.data) {
                console.log(response);
                setPraxe(response.data);
            }
            await getPraxe();
        };

        const checkRole = () => {
            return localStorage.getItem("role") !== "ROLE_STUDENT";
        };

        const getSchools = async () => {
            const response = await axios({
                url: "http://localhost:8080/user/schools",
                withCredentials: true,
                method: "GET",
            }).then((response) => {
                console.log("schools where", response.data);
                var sch = [];
                response.data.forEach(element => sch.push(element.name));
                setSchools(sch);

            });
        };

        const handleSelect = (ranges) => {
            console.log(ranges);
            // {
            //   selection: {
            //     startDate: [native Date Object],
            //     endDate: [native Date Object],
            //   }
            // }
        }

        const getButton = (isReserved, id) => {
            if (!isReserved) {
                return (
                    <ReservationButtonComponent
                        text={reservation}
                        onClick={() => registerRequest(id)}
                    />
                );
            } else {
                return (
                    <UnReservationButtonComponent
                        text={unReservation}
                        onClick={() => unRegisterRequest(id)}
                    />
                );
            }
        };
        if (checkRole()) return <Navigate to="/login"/>;
        return (
            <Container fluid>
                <div>
                    <button id="toggleBtn" className="toggleButtonFilters" onClick={() => {
                        setShowing(!showing);
                        changeBtnText();
                    }}><BsSearch style={iconStyles}/> {btnText}</button>
                    <TransitionGroup>
                        <CSSTransition>
                            <div style={{overflow: 'hidden'}}>
                                <div className={!showing ? 'hideDiv' : 'calendarDivHeight'}>
                                    <div className="customFilters">
                                        <h3 className="filters-heading">Filtry</h3>
                                        <div className="col align-self-center">
                                            <div className="align-self-center search-school">
                                                <p>Vyhledávání podle školy</p>
                                                <Combobox
                                                    data={schools}
                                                    value={selectedSchool}
                                                    onChange={value => setSelectedSchools(value)}
                                                />
                                            </div>
                                            <div className="align-self-center search-school">
                                                <p>Vyhledávání podle názvu předmětu</p>
                                                <Combobox
                                                    data={schools}
                                                    value={selectedSchool}
                                                    onChange={value => setSelectedSchools(value)}
                                                />
                                            </div>
                                            <div className="align-self-center search-school">
                                                <p>Vyhledávání podle jména učitele</p>
                                                <Combobox
                                                    data={schools}
                                                    value={selectedSchool}
                                                    onChange={value => setSelectedSchools(value)}
                                                />
                                            </div>
                                        </div>
                                        <div className="col align-self-center search-date">
                                            <p>Vyhledávání podle data praxe</p>
                                            <DateRange
                                                editableDateInputs={true}
                                                onChange={item => setState([item.selection])}
                                                moveRangeOnFirstSelection={false}
                                                ranges={state}
                                                locale={rdrLocales.cs}
                                                minDate={new Date("2022-1-1")}
                                                maxDate={new Date("2022-5-1")}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CSSTransition>
                    </TransitionGroup>
                    <hr/>
                </div>
                <Accordion>
                    <div style={{width: "85%"}}>
                        <div className="title-container text-info-practice">
                            <Row style={{width: "100%"}}>
                                <Col className="text-center">
                                    <b>Předmět</b>
                                </Col>
                                <Col className="text-center d-none">
                                    <b>Učitel</b>
                                </Col>
                                <Col className="text-center d-none d-xl-block">
                                    <b>Škola</b>
                                </Col>
                                <Col className="text-center">
                                    <b>Datum</b>
                                </Col>
                                <Col className="text-center d-none">
                                    <b>Čas</b>
                                </Col>
                                <Col className="text-center d-none">
                                    <b>E-mail</b>
                                </Col>
                                <Col className="text-center d-none">
                                    <b>Kapacita</b>
                                    <OverlayTrigger
                                        overlay={
                                            <Tooltip>
                                                Počet aktuálně zapsaných studentů / maximální počet
                                                studentů na praxi.
                                            </Tooltip>
                                        }
                                    >
                                    <span>
                                        <BsInfoCircleFill className={"info-tooltip"}/>
                                    </span>
                                    </OverlayTrigger>
                                </Col>
                            </Row>
                        </div>
                    </div>
                    {search(practices).map((item, index) => (
                        <Accordion.Item
                            eventKey={item.id}
                            key={index}
                            style={{display: "block"}}
                        >
                            <div style={{display: "flex"}}>
                                <Accordion.Header className={"accordion-header"}>
                                    <Row style={{width: "100%"}}>
                                        <Col className="text-center  ">{item.subject.name}</Col>
                                        <Col className="text-center d-none">
                                            {item.teacher.firstName + " " + item.teacher.secondName}
                                        </Col>
                                        <Col className="text-center d-none d-xl-block">{item.teacher.school.name}</Col>
                                        <Col className="text-center">
                                            {item.date.split("-")[2] +
                                            ". " +
                                            item.date.split("-")[1] +
                                            ". " +
                                            item.date.split("-")[0]}
                                        </Col>
                                        <Col className="text-center d-none">
                                            {item.start.split(":")[0] +
                                            ":" +
                                            item.start.split(":")[1] +
                                            " - " +
                                            item.end.split(":")[0] +
                                            ":" +
                                            item.end.split(":")[1]}
                                        </Col>
                                        <Col className="text-center d-none">
                                            {item.teacher.username}
                                        </Col>
                                        <Col className="text-center badge d-none">
                                            <div>
                                                <Badge
                                                    bg={
                                                        item.numberOfReservedStudents < item.capacity - 1
                                                            ? "success"
                                                            : "danger"
                                                    }
                                                >
                                                    {item.numberOfReservedStudents} / {item.capacity}
                                                </Badge>
                                            </div>
                                        </Col>
                                    </Row>
                                </Accordion.Header>
                                <div className="center d-none d-xl-block" style={{width: "15%"}}>
                                    {getButton(item.isCurrentStudentReserved, item.id)}
                                </div>
                            </div>

                            <Accordion.Body>
                                <div>
                                    <hr/>
                                    <div style={{marginLeft: "50px"}}>
                                        <p><b>Učitel:</b> {item.teacher.firstName + " " + item.teacher.secondName}</p>
                                        <p><b>E-mail:</b> {item.teacher.username}</p>
                                        <p><b>Čas: </b>
                                            <span>
                                            {item.start.split(":")[0] +
                                            ":" +
                                            item.start.split(":")[1] +
                                            " - " +
                                            item.end.split(":")[0] +
                                            ":" +
                                            item.end.split(":")[1]}</span></p>

                                        <b>Kapacita: </b>
                                        <span>
                                        <Badge
                                            bg={
                                                item.numberOfReservedStudents < item.capacity - 1
                                                    ? "success"
                                                    : "danger"
                                            }
                                        >
                                            {item.numberOfReservedStudents} / {item.capacity}
                                        </Badge>
                                    </span>

                                        <p style={{marginTop: "10px"}}><i>Poznámka:</i> {item.note}</p>

                                        <p style={{marginTop: "10px"}}><b>Soubory ke stažení:</b>
                                            <ul>
                                                {item.fileNames.map(function (name, index) {
                                                    return <li key={index}><a
                                                        href={`http://localhost:8080/user/download/${item.teacher.username}/${name}`}>{name}</a>
                                                    </li>;
                                                })}
                                            </ul>
                                        </p>

                                        <div className="center d-xl-none" style={{width: "15%"}}>
                                            {getButton(item.isCurrentStudentReserved, item.id)}
                                        </div>

                                    </div>
                                </div>
                            </Accordion.Body>
                        </Accordion.Item>
                    ))}
                </Accordion>
            </Container>
        );
    }
;

export default PracticeListComponent;
