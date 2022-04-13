import React, {useEffect, useState} from 'react';
import FileManagementComponent from "./FileManagementComponent";
import {axios} from "../../axios";
import "./TeacherPersonalPageComponent.css";
import {BsAt, BsFillPersonFill, BsPhone, BsTools} from "react-icons/bs";
import {FaGraduationCap} from "react-icons/fa"

const TeacherPersonalPageComponent = () => {
    let iconStyles = {fontSize: "1.35em", marginRight: "10px"};
    const [name, setName] = useState("");
    const [school, setSchool] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");

    const getCurrentRole = () => {
        return JSON.parse(localStorage.getItem("user"));
    }

    const getUserData = async () => {
        if (getCurrentRole() == null) return;
        console.log("fetching user data");
        const response = await axios({
            url: "http://localhost:8080/user/data",
            withCredentials: true,
            method: "GET",
        }).catch((err) => {
            alert(err.response.data.message);
            console.log(err.response.data.message);
        });
        if (response && response.data) {
            setName((response.data.firstName + " " + response.data.secondName));
            setSchool(response.data.school.name);
            setEmail(response.data.username);
            setPhone(response.data.phoneNumber);
        }
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
                        <div style={{paddingTop: "15px"}}>
                            <FileManagementComponent/>
                        </div>
                    </div>
                    <p className="mt-4 mb-4">Aktuálně nahrané soubory: </p>
                    <ul>
                        <li style={{marginLeft: "20px"}}>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default TeacherPersonalPageComponent;