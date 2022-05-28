import React, {useEffect, useState} from 'react';
import {axios} from "../../../../axios";
import "./LoginInformationStyles.css";


const URL = `${process.env.REACT_APP_AXIOS_URL}`;

const GET_USER_INFO_URL = `${URL}/user/info`;

let empty = "";

export const LoginInformationComponent = ({isLoggedIn}) => {
    const [name, setName] = useState([]);
    const [role, setRole] = useState("");

    const getCurrentRole = () => {
        return JSON.parse(localStorage.getItem("user"));
    }

    const getUserName = async () => {
        if (getCurrentRole() == null) return;
        if (getCurrentRole() !== null) {
            console.log("fetching user info");
            const response = await axios({
                url: GET_USER_INFO_URL,
                withCredentials: true,
                method: "GET",
            }).catch((err) => {
                alert(err.response.data.message);
                console.log(err.response.data.message);
            });
            if (response && response.data) {
                setName(response.data.firstName + " " + response.data.secondName);
                if (response.data.role === "ROLE_COORDINATOR") {
                    setRole("Koordinátor");
                } else if (response.data.role === "ROLE_TEACHER") {
                    setRole("Učitel");
                } else if (response.data.role === "ROLE_ADMIN") {
                    setRole("Administrátor");
                } else if (response.data.role === "ROLE_STUDENT") {
                    setRole("Student");
                }
            } else {
                document.getElementById("sign-out-click").click(); //should log out the user if he has no token/role
                //still need to figure out what to do if access token is expired (all requests on page load are rejected but only after they all happen the user gets signed out)
            }
        }
    };
    useEffect(() => {
        getUserName();
    }, []);

    if (name != null && isLoggedIn) {
        return (
            <div className="text-center login-info" style={{marginTop: "12px"}}>
                <p style={{marginBottom: "0px"}}>Přihlášen jako: <b>{name}</b></p>
                <p>Role: <b>{role}</b></p>
            </div>
        )
    } else {
        return (
            <div>
                {empty}
            </div>
        )
    }
}
export default LoginInformationComponent;