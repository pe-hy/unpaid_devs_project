import React, { useEffect } from 'react';
import FileManagementComponent from "./FileManagementComponent";
import { axios } from "../../axios";
import { useState } from "react";
import "./TeacherPersonalPageComponent.css";

const TeacherPersonalPageComponent = () => {

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
        <div>
            <p><b>Jméno:</b> {name}</p>
            <p><b>Škola:</b> {school}</p>
            <p><b>E-mail:</b> {email}</p>
            <p><b>Telefon</b>: {phone}</p>
            <p><b>Změna hesla:</b>
                <a href="https:3000/user/changePassword"> Změnit</a></p>
            <p>Nahrané soubory: </p>
            <FileManagementComponent />
        </div>
    )
}

export default TeacherPersonalPageComponent;