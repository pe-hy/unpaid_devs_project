import "./TeacherPassedPractices.css";
import Accordion from "react-bootstrap/Accordion";
import React, { useEffect, useRef, useState } from "react";
import { Col, Container, Form, OverlayTrigger, Row, Tooltip } from "react-bootstrap";
import { axios } from "../../../axios.js";
import { BsFillXCircleFill, BsInfoCircleFill, BsSearch, BsSliders } from "react-icons/bs";
import Badge from "react-bootstrap/Badge";
import Combobox from "react-widgets/Combobox";
import "react-widgets/styles.css";
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import * as rdrLocales from 'react-date-range/dist/locale';
import { DateRange } from 'react-date-range';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { addDays } from 'date-fns';

const URL = `${process.env.REACT_APP_AXIOS_URL}`;

const GET_PRACTICE_LIST_URL_LISTED = `${URL}/teacher/practices-list-past`;
const GET_SUBJECTS_URL = `${URL}/user/subjects`;
const UPLOAD_URL = `${URL}/teacher/report/upload`;

export const TeacherPassedPractices = () => {
    let iconStyleFilter = { fontSize: "1.5em", marginRight: "15px" };
    const schoolFilterParam = "School";
    const subjectFilterParam = "Subject";
    const teacherFilterParam = "Teacher";
    const dateRangeFilterParam = "Date";
    const allFilterParam = "All";
    const noteNotFound = "Poznámka nevyplněna";
    const [subjects, setSubjects] = useState([]);
    let iconStyles = { fontSize: "1.5em", marginRight: "5px" };
    const [showing, setShowing] = useState(false);
    const [practices, setPraxe] = useState([]);
    const [filterParam, setFilterParam] = useState([allFilterParam]);
    const [dateLimit, setDateLimit] = useState([addDays(new Date(), -30), addDays(new Date(), 30)]);
    const schoolNotFound = "Škola nevyplněna";
    const subjectNotFound = "Předmět nevyplněn";
    const [selectedSchool, setSelectedSchools] = useState("");
    const [selectedSubjectName, setSelectedSubjectName] = useState("");
    const [selectedTeacherName, setSelectedTeacherName] = useState("");
    const [btnText, setBtnText] = useState("Zobrazit možnosti vyhledávání");
    const [selectedFile, setSelectedFile] = useState("");
    const [selectedId, setSelectedId] = useState("");
    const [dateRange, setDateRange] = useState([
        {
            startDate: new Date(),
            endDate: new Date(),
            key: 'selection'
        }
    ]);

    //state for checking file size
    const [fileSize, setFileSize] = useState(true);
    // for file upload progress message
    const [fileUploadProgress, setFileUploadProgress] = useState(false);
    //for displaying response message
    const [fileUploadResponse, setFileUploadResponse] = useState(null);

    const onFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const onFileUpload = (e, id) => {
        e.preventDefault();
        let formData = new FormData();
        console.log(id, "selected id");
        formData.append('file', selectedFile);
        formData.append('id', id);

        axios({
            method: 'POST',
            url: UPLOAD_URL,
            withCredentials: true,
            headers: { 'content-type': 'application/json' },
            data: formData,
        }).then(function (response) {
            console.log(JSON.stringify(response.data));
        })
            .catch(function (error) {
                console.log(error);
                const resMessage =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();
            });
    }

    let onFileUploada = () => {

        console.log(selectedFile);
        const formData = new FormData();
        formData.append('files', selectedFile);
        formData.append('id', selectedId);
        axios.post(`${URL}/teacher/report/upload`, formData, {
            headers: { 'content-type': 'application/json' },
            withCredentials: true,
        })
            .then(res => {
                console.log(res);
                console.log(res.data);
            })
            .catch(err => {
                console.log(err);
            });
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

    const getPraxe = async () => {
        const response = await axios({
            url: GET_PRACTICE_LIST_URL_LISTED,
            withCredentials: true,
            method: "GET",
        }).catch((err) => {
            alert(err.response.data.message);
            console.log(err.response.data.message);
        });
        if (response && response.data) {
            setPraxe(response.data);
            setDateRangeLimit(response.data);
        }
    };

    useEffect(() => {
        getPraxe();
        getSubjects();
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
                                    <div className="col align-self-center">
                                        <div className="align-self-center search-school">
                                            <p>Vyberte předmět</p>
                                            <Combobox
                                                data={subjects}
                                                value={selectedSubjectName}
                                                onChange={value => selectSubjectChange(value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="col align-self-center search-date">
                                        <p>Vyberte datum (od - do)</p>
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
                <div style={{ width: "100%" }}>
                    <div className="title-container text-info-practice">
                        <Row style={{ width: "100%" }}>
                            <Col className="text-center">
                                <b>Předmět</b>
                            </Col>
                            <Col className="text-center d-none">
                                <b>Učitel</b>
                            </Col>
                            <Col className="text-center">
                                <b>Datum</b>
                            </Col>
                            <Col className="text-center">
                                <b>Čas</b>
                            </Col>
                            <Col className="text-center d-none">
                                <b>E-mail</b>
                            </Col>
                            <Col className="text-center d-none">
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
                                <b>Kapacita</b>
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
                            <Accordion.Header className={"accordion-header-listed-teacher"}>
                                <Row style={{ width: "100%" }}>
                                    <Col
                                        className="text-center  ">{item.subject != null ? item.subject.name : subjectNotFound}</Col>
                                    <Col className="text-center d-none">
                                        {item.teacher.firstName + " " + item.teacher.secondName}
                                    </Col>
                                    <Col className="text-center">
                                        {item.date.split("-")[2] +
                                            ". " +
                                            item.date.split("-")[1] +
                                            ". " +
                                            item.date.split("-")[0]}
                                    </Col>
                                    <Col className="text-center">
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
                        </div>

                        <Accordion.Body>
                            <div className="row listed-practices-row">
                                <hr />
                                <div className="col" style={{ marginLeft: "50px" }}>
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
                                    <div className="d-flex" style={{ marginTop: "10px" }}>
                                        <div><b>Registrovaní studenti: </b>
                                            {item.studentNames.length === 0 &&
                                                <span><i>Žádný student se na praxi nezaregistroval.</i></span>}
                                        </div>
                                        <div>{item.studentNames.map((item, index) => (
                                            <div className="margin-left-cstm">{item}</div>))}</div>
                                    </div>

                                    <p style={{ marginTop: "10px" }}><b>Poznámka:</b> {item.note != null ? item.note :
                                        <i>{noteNotFound}</i>}</p>

                                    <p style={{ marginTop: "10px" }}><b>Soubory ke stažení:</b></p>
                                    <ul>
                                        {item.fileNames.length === 0 ?
                                            <p><i>Žádný soubor nebyl nahrán</i></p>
                                            : ""}
                                        {item.fileNames.map((name, index) => (
                                            <li key={index}>
                                                <a href={`${URL}/user/download/${item.teacher.username}/${name}`}>{name}</a>
                                            </li>
                                        ))
                                        }
                                    </ul>

                                </div>
                                <div className="center col div-cstm-flex-direction">
                                    <Form>
                                        <Form.Group onChange={onFileChange} controlId="formFile" className="mb-3">
                                            <Form.Control type="file" />
                                        </Form.Group>
                                        <button className="toggleButtonFilters" onClick={(e) => {onFileUpload(e, item.id) }}>
                                            Nahrát report
                                        </button>
                                    </Form>

                                    <div className="mt-3">
                                        <OverlayTrigger
                                            overlay={
                                                <Tooltip>
                                                    Toto uvidíte pouze vy, koordinátoři a student, který byl zapsán na
                                                    tuto praxi.
                                                </Tooltip>
                                            }
                                        >
                                            <span>
                                                <BsInfoCircleFill className={"info-tooltip"} />
                                            </span>
                                        </OverlayTrigger>
                                        <b>Report ke stažení:</b>
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

export default TeacherPassedPractices;
