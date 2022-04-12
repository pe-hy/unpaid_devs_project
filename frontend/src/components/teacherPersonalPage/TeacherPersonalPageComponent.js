import React from 'react';
import FileManagementComponent from "./FileManagementComponent";

const TeacherPersonalPageComponent = () => {
    return (
        <div>
            <p>Jméno: </p>
            <p>Škola: </p>
            <p>E-mail: </p>
            <p>Telefon: </p>
            <p>Změna hesla: </p>
            <p>Nahrané soubory: </p>
            <FileManagementComponent/>
        </div>
    )
}

export default TeacherPersonalPageComponent;