import React, {useEffect, useState} from 'react';
import FileManagementComponent from "./FileManagementComponent";
import {axios} from "../../axios";
import "./TeacherPersonalPageComponent.css";
import {BsAt, BsFillPersonFill, BsPhone, BsTools} from "react-icons/bs";
import {FaGraduationCap} from "react-icons/fa"
import {Modal} from "react-bootstrap";

const TeacherPersonalPageComponent = () => {
    let iconStyles = {fontSize: "1.35em", marginRight: "10px"};
    const [name, setName] = useState("");
    const [school, setSchool] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [files, setFiles] = useState([]);
    const [deleteDisable, setDeleteDisable] = useState(false);
    const [modalShow, setModalShow] = React.useState(false);
    const [currFile, setCurrFile] = useState("");

    function delay(time) {
        return new Promise(resolve => setTimeout(resolve, time));
    }

    function CreateModal(props) {
        return (
            <Modal
                {...props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                </Modal.Header>
                <Modal.Body>
                    <h4>Vymazání souboru</h4>
                    <p>
                        Jste si jisti, že chcete tento soubor smazat?
                    </p>
                </Modal.Body>
                <Modal.Footer>
                    <button type="button" className="accept-btn my-btn-white" onClick={props.onHide}>Storno</button>
                    <button type="button" className="removal-btn" onClick={() => {props.onHide(); deleteFile(currFile);}}>Smazat</button>
                </Modal.Footer>
            </Modal>
        );
    }

    const deleteFile = async (fileName) => {
        setDeleteDisable(true);
        const response = await axios({
            headers: {'content-type': 'application/json'},
            url: `http://localhost:8080/user/file/delete/${email}/${fileName}`,
            withCredentials: true,
            method: "POST",
        }).catch((err) => {
            alert(err.response.data.message);
            console.log(err.response.data.message);
        });
        if (response && response.data) {
            console.log(response);
            delay(100).then(() => {
                getUserData();
                delay(50).then(() => {
                    setDeleteDisable(false);
                });
            });
            // await getUserData();
        }
    };

    const getCurrentRole = () => {
        return JSON.parse(localStorage.getItem("user"));
    }

    const getUserData = async () => {
        if (getCurrentRole() == null) return;
        console.log("fetching user data");

        // Make first two requests
        const response = await Promise.all([

            axios({
                url: "http://localhost:8080/user/data",
                withCredentials: true,
                method: "GET",
            }),
        ]);

        // Make third request using responses from the first two
        const response2 = await axios({
            url: "http://localhost:8080/user/teacherFiles/" + response[0].data.username,
            withCredentials: true,
            method: "GET",
        });

        // Update state once with all 3 responses
        setName((response[0].data.firstName + " " + response[0].data.secondName));
        setSchool(response[0].data.school.name);
        setEmail(response[0].data.username);
        setPhone(response[0].data.phoneNumber);
        setFiles(response2.data);
    };

    useEffect(() => {
        getUserData();
    }, []);

    return (
        <div style={{marginTop: "30px"}}>
            <div className="row">
                <div className="col-sm">
                    <h1>Osobní stránka</h1>
                    <p style={{paddingTop: "25px"}}><BsFillPersonFill style={iconStyles}/><b>Jméno:</b> {name}</p>
                    <p><b><FaGraduationCap style={iconStyles}/>Škola:</b> {school}</p>
                    <p><b><BsAt style={iconStyles}/>E-mail:</b> {email}</p>
                    <p><b><BsPhone style={iconStyles}/>Telefon</b>: {phone}</p>
                    <p><b><BsTools style={iconStyles}/>Změna hesla: </b>
                        <a href="user/changePassword">Změnit</a></p>
                </div>
                <div className="col-sm">
                    <div className="uploadCol">
                        <h1 className="custHeadingUploadCol">Nahrávání souborů</h1>
                        <div style={{paddingTop: "15px", paddingBottom: "15px"}}>
                            <FileManagementComponent
                                userDataRef={() => {
                                    delay(100).then(() =>
                                        getUserData()
                                    );
                                }}
                            />
                        </div>
                    </div>
                    <p><i>Tyto soubory si může stáhnout student, pokud otevře jakoukoliv z vašich vypsaných praxí.</i>
                    </p>
                    <p className="mt-4 mb-4"><b>Aktuálně nahrané soubory:</b></p>
                    {!files.length &&
                    <i>Prozatím jste nenahráli žádný soubor.</i>
                    }
                    <ul>
                        {files.map(function (name, index) {
                            return <li key={index} style={{marginLeft: "20px", marginTop: "20px"}}>
                                <a href={`http://localhost:8080/user/download/${email}/${name}`}>{name}</a>
                                <button disabled={deleteDisable} onClick={() => {
                                    setModalShow(true);
                                    setCurrFile(name);
                                }} style={{marginLeft: "20px", fontSize: "16px"}} type="button"
                                        className={"removal-btn-2"}>X
                                </button>
                            </li>;
                        })}
                    </ul>
                </div>
            </div>
            <CreateModal
                show={modalShow}
                onHide={() => setModalShow(false)}
            />
        </div>
    )
}

export default TeacherPersonalPageComponent;