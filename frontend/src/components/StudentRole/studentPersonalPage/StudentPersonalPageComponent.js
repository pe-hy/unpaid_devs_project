import React, {useEffect, useState} from 'react';
import {axios} from "../../../axios";
import "./StudentPersonalPageComponent.css";
import {BsAt, BsFillPersonFill, BsPhone, BsTools} from "react-icons/bs";
import ChangePasswordComponent from "../../UnspecifiedRoles/changePassword/ChangePasswordComponent";

const URL = `${process.env.REACT_APP_AXIOS_URL}`;
const GET_DATA_URL = `${URL}/user/data`;

const StudentPersonalPageComponent = () => {
    let iconStyles = {fontSize: "1.35em", marginRight: "10px"};
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [showPassword, setShowPassword] = useState(true);
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
                    <p><b><BsAt style={iconStyles}/>E-mail:</b> {email}</p>
                    <p><b><BsTools style={iconStyles}/>Změna hesla: <ChangePasswordComponent/></b></p>

                </div>
            </div>
        </div>
    )
}

export default StudentPersonalPageComponent;