import "./PracticeListComponent.css";
import Accordion from "react-bootstrap/Accordion";
import React, { useEffect, useState } from "react";
import { Col, Container, OverlayTrigger, Row, Tooltip } from "react-bootstrap";
import { axios } from "../../../axios.js";
import { BsFillXCircleFill, BsInfoCircleFill, BsSearch, BsSliders } from "react-icons/bs";
import ReservationButtonComponent from "./reservationButton/ReservationButtonComponent";
import Badge from "react-bootstrap/Badge";
import UnReservationButtonComponent from "./reservationButton/UnReservationButtonComponent";
import Combobox from "react-widgets/Combobox";
import "react-widgets/styles.css";
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import * as rdrLocales from 'react-date-range/dist/locale';
import { DateRange } from 'react-date-range';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { addDays } from 'date-fns';
import { useDispatch } from 'react-redux';
import { addTodo } from '../../../redux/todoSlice.js';

const URL = `${process.env.REACT_APP_AXIOS_URL}`;

const GET_SCHOOLS_URL = `${URL}/user/schools`;
const GET_PRACTICE_LIST_URL = `${URL}/student/practices-list`;
const GET_SUBJECTS_URL = `${URL}/user/subjects`;
const GET_TEACHERS_URL = `${URL}/user/teachers`;

export const PracticeListComponent = () => {
    const reservation = "Rezervovat";
    const unReservation = "Odrezervovat";
    const schoolNotFound = "Škola nevyplněna";
    const subjectNotFound = "Předmět nevyplněn";
    const schoolFilterParam = "School";
    const subjectFilterParam = "Subject";
    const teacherFilterParam = "Teacher";
    const dateRangeFilterParam = "Date";
    const allFilterParam = "All";

    let iconStyles = { fontSize: "1.5em", marginRight: "5px" };
    let iconStyleFilter = { fontSize: "1.5em", marginRight: "15px" };
    const duration = 250;
    const [showing, setShowing] = useState(false);
    const [practices, setPraxe] = useState([]);
    const [filterParam, setFilterParam] = useState([allFilterParam]);
    const [schools, setSchools] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [dateLimit, setDateLimit] = useState([addDays(new Date(), -30), addDays(new Date(), 30)]);

    const [value, setValue] = useState('');
	const dispatch = useDispatch();

    const [selectedSchool, setSelectedSchools] = useState("");
    const [selectedSubjectName, setSelectedSubjectName] = useState("");
    const [selectedTeacherName, setSelectedTeacherName] = useState("");
    const [btnText, setBtnText] = useState("Zobrazit možnosti vyhledávání");
    const [dateRange, setDateRange] = useState([
        {
            startDate: new Date(),
            endDate: new Date(),
            key: 'selection'
        }
    ]);

    const onSubmit = () => {
		if (value) {
            console.log("dispatched");
			dispatch(
				addTodo({
					title: value,
				})
			);
		}
	};

    const changeBtnText = () => {
        if (!showing) {
            setBtnText("Schovat možnosti vyhledávání");
        } else {
            setBtnText("Zobrazit možnosti vyhledávání");
        }
    }

    function resetFilter() {
        setFilterParam([allFilterParam]);
        setSelectedSchools("");
        setSelectedSubjectName("");
        setSelectedTeacherName("");
        setDateRange([
            {
                startDate: new Date(),
                endDate: new Date(),
                key: 'selection'
            }
        ]);
    }

    const getPraxe = async () => {
        const response = await axios({
            url: GET_PRACTICE_LIST_URL,
            withCredentials: true,
            method: "GET",
        }).catch((err) => {
            alert(err.response.data.message);
            console.log(err.response.data.message);
        });
        if (response && response.data) {
            setPraxe(response.data);
            setDateRangeLimit(response.data);
            setValue("heeey", new Date());
            onSubmit();
        }
    };

    useEffect(() => {
        getPraxe();
        getSchools();
        getSubjects();
        getTeachers();
    }, []);

    function setDateRangeLimit(practices) {
        let lowestDate = new Date(practices[0].date.split('-'));
        let highestDate = new Date(practices[0].date.split('-'));

        practices.forEach(element => {
            if (new Date(element.date.split('-')) < lowestDate) {
                lowestDate = new Date(element.date.split('-'))
            }
            if (new Date(element.date.split('-')) > highestDate) {
                highestDate = new Date(element.date.split('-'))
            }
        });
        setDateLimit([addDays(lowestDate, -1), addDays(highestDate, 1)]);
    }

    function search(items) {
        return items.filter((item) => {

            if (filterParam.includes(allFilterParam)) {
                console.log("passing filter - All");
                return true;
            }

            if (filterParam.includes(schoolFilterParam) && (item.teacher.school == null || item.teacher.school.name != selectedSchool)) {
                return false;
            }

            if (filterParam.includes(subjectFilterParam) && (item.subject == null || item.subject.name != selectedSubjectName)) {
                return false;
            }

            if (filterParam.includes(teacherFilterParam) && (item.teacher.firstName != selectedTeacherName.split(" ")[0] || item.teacher.secondName != selectedTeacherName.split(" ")[1])) {
                return false;
            }

            if (filterParam.includes(dateRangeFilterParam) && (new Date(item.date.split('-')) < dateRange[0].startDate || new Date(item.date.split('-')) > dateRange[0].endDate)) {
                return false;
            }
            return true;
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

    const getSchools = async () => {
        const response = await axios({
            url: GET_SCHOOLS_URL,
            withCredentials: true,
            method: "GET",
        }).then((response) => {
            var sch = [];
            response.data.forEach(element => sch.push(element.name));
            setSchools(sch);
        });
    };

    const getSubjects = async () => {
        const response = await axios({
            url: GET_SUBJECTS_URL,
            withCredentials: true,
            method: "GET",
        }).then((response) => {
            var sch = [];
            response.data.forEach(element => sch.push(element.name));
            setSubjects(sch);

        });
    };

    const getTeachers = async () => {
        const response = await axios({
            url: GET_TEACHERS_URL,
            withCredentials: true,
            method: "GET",
        }).then((response) => {
            var sch = [];
            let res =
                response.data.forEach(element => {
                    let str = element.firstName.concat(" ", element.secondName);
                    sch.push(str)
                });
            setTeachers(sch);
        });
    };

    const selectSchoolsChange = (value) => {
        const index = filterParam.indexOf(allFilterParam);
        if (index > -1) {
            filterParam.splice(index, 1);
        }
        if (!filterParam.includes(schoolFilterParam)) {
            filterParam.push("School")
        }
        setSelectedSchools(value);
    }

    const selectSubjectChange = (value) => {
        const index = filterParam.indexOf(allFilterParam);
        if (index > -1) {
            filterParam.splice(index, 1);
        }
        if (!filterParam.includes(subjectFilterParam)) {
            filterParam.push(subjectFilterParam)
        }
        setSelectedSubjectName(value);
    }

    const selectTeacherChange = (value) => {
        const index = filterParam.indexOf(allFilterParam);
        if (index > -1) {
            filterParam.splice(index, 1);
        }
        if (!filterParam.includes(teacherFilterParam)) {
            filterParam.push(teacherFilterParam)
        }
        setSelectedTeacherName(value);
    }

    const selectDateRange = (ranges) => {
        const index = filterParam.indexOf(allFilterParam);
        if (index > -1) {
            filterParam.splice(index, 1);
        }
        if (!filterParam.includes(dateRangeFilterParam)) {
            filterParam.push(dateRangeFilterParam)
        }
        ranges.selection.endDate.setHours(23, 59, 59);
        setDateRange([ranges.selection]);
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
    return (
        <Container fluid>
            <div>
                <button id="toggleBtn" className="toggleButtonFilters" onClick={() => {
                    setShowing(!showing);
                    changeBtnText();
                }}><BsSearch style={iconStyles} /> {btnText}</button>
                <TransitionGroup>
                    <CSSTransition>
                        <div style={{ overflow: 'hidden' }}>
                            <div className={!showing ? 'hideDiv' : 'calendarDivHeight'}>
                                <div className="customFilters">
                                    <h3 className="filters-heading">Filtry</h3>
                                    <div className="col align-self-center">
                                        <div className="align-self-center search-school">
                                            <p>Vyhledávání podle školy</p>
                                            <Combobox
                                                data={schools}
                                                value={selectedSchool}
                                                onChange={value => selectSchoolsChange(value)}
                                            />
                                        </div>
                                        <div className="align-self-center search-school">
                                            <p>Vyhledávání podle názvu předmětu</p>
                                            <Combobox
                                                data={subjects}
                                                value={selectedSubjectName}
                                                onChange={value => selectSubjectChange(value)}
                                            />
                                        </div>
                                        <div className="align-self-center search-school">
                                            <p>Vyhledávání podle jména učitele</p>
                                            <Combobox
                                                data={teachers}
                                                value={selectedTeacherName}
                                                onChange={value => selectTeacherChange(value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="col align-self-center search-date">
                                        <p>Vyhledávání podle data praxe</p>
                                        <DateRange
                                            editableDateInputs={true}
                                            onChange={item => selectDateRange(item)}
                                            moveRangeOnFirstSelection={false}
                                            ranges={dateRange}
                                            locale={rdrLocales.cs}
                                            minDate={dateLimit[0]}
                                            maxDate={dateLimit[1]}
                                        />
                                    </div>
                                </div>
                                <div className="center">
                                    <button id="filterResetBtn" className="filterResetBtn" onClick={() => {
                                        resetFilter();
                                    }}><BsFillXCircleFill style={iconStyles} /> Reset
                                    </button>
                                </div>
                            </div>
                        </div>
                    </CSSTransition>
                </TransitionGroup>
                <hr />
            </div>
            {!filterParam.includes(allFilterParam) && <div className="customAlertContainer">
                <div className="p-3 m-3 center my-alert-filter alert-danger alertCustom">
                    <BsSliders style={iconStyleFilter} />
                    <span><b>Filtr je aktivní</b></span>
                </div>
            </div>}
            <Accordion>
                <div style={{ width: "85%" }}>
                    <div className="title-container text-info-practice">
                        <Row style={{ width: "100%" }}>
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
                                        <BsInfoCircleFill className={"info-tooltip"} />
                                    </span>
                                </OverlayTrigger>
                            </Col>
                        </Row>
                    </div>
                </div>
                {search(practices).length == 0 ?
                    <div className="alert alert-danger center warnTextPractices"><span>Nebyly nalezeny žádné praxe odpovídající zadaným parametrům.</span>
                    </div> : null}
                {practices && search(practices).map((item, index) => (
                    <Accordion.Item
                        eventKey={item.id}
                        key={index}
                        style={{ display: "block" }}
                    >
                        <div style={{ display: "flex" }}>
                            <Accordion.Header className={"accordion-header"}>
                                <Row style={{ width: "100%" }}>
                                    <Col className="text-center  ">{item.subject != null ? item.subject.name : subjectNotFound}</Col>
                                    <Col className="text-center d-none">
                                        {item.teacher.firstName + " " + item.teacher.secondName}
                                    </Col>
                                    <Col className="text-center d-none d-xl-block">{item.teacher.school != null ? item.teacher.school.name : schoolNotFound}</Col>
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
                            <div className="center d-none d-xl-block" style={{ width: "15%" }}>
                                {getButton(item.isCurrentStudentReserved, item.id)}
                            </div>
                        </div>

                        <Accordion.Body>
                            <div>
                                <hr />
                                <div style={{ marginLeft: "50px" }}>
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

                                    <p style={{ marginTop: "10px" }}><i>Poznámka:</i> {item.note}</p>

                                    <p style={{ marginTop: "10px" }}><b>Soubory ke stažení:</b></p>
                                    <ul>
                                        {item.fileNames.map(function (name, index) {
                                            return <li key={index}><a
                                                href={`${URL}/user/download/${item.teacher.username}/${name}`}>{name}</a>
                                            </li>;
                                        })}
                                    </ul>


                                    <div className="center d-xl-none" style={{ width: "15%" }}>
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
