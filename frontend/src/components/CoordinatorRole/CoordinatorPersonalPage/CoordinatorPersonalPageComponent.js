import React, {useEffect, useState} from 'react';
import {axios} from "../../../axios";
import "./CoordinatorPersonalPageComponent.css";
import {BsAt, BsFillPersonFill, BsPhone, BsTools} from "react-icons/bs";
import {FaGraduationCap} from "react-icons/fa"

const URL = `${process.env.REACT_APP_AXIOS_URL}`;
const GET_DATA_URL = `${URL}/user/data`;

const CoordinatorPersonalPageComponent = () => {
    let iconStyles = {fontSize: "1.35em", marginRight: "10px"};
    const [name, setName] = useState("");
    const [school, setSchool] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const schoolNotFound = "Škola nevyplněna";

    const getUserData = async () => {

        // Make first two requests
        const response = await Promise.all([

            axios({
                url: GET_DATA_URL,
                withCredentials: true,
                method: "GET",
            }),
        ]);

        // Make third request using responses from the first two
        const response2 = await axios({
            url: `${URL}/user/teacherFiles/${response[0].data.username}`,
            withCredentials: true,
            method: "GET",
        });

        // Update state once with all 3 responses
        setName((response[0].data.firstName + " " + response[0].data.secondName));
        setSchool(response[0].data.school != null ? response[0].data.school.name : schoolNotFound);
        setEmail(response[0].data.username);
        setPhone(response[0].data.phoneNumber);
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
            </div>
        </div>
    )
}

export default CoordinatorPersonalPageComponent;