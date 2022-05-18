import React from 'react'
import {axios} from "../../../axios";

const URL = `${process.env.REACT_APP_AXIOS_URL}`;

const GET_TEACHERS_URL = `${URL}/user/teachers`;

function ShowTeachers() {

    //create const for teachers
    const [teachers, setTeachers] = React.useState([]);

    //create UseEffect
    const getTeachers = async () => {
        const response = await axios({
            url: GET_TEACHERS_URL,
            withCredentials: true,
            method: "GET",
        }).then((response) => {
            response.data.forEach(element => teachers.push(element.name));
            setTeachers(response.data);
        });
    };

    React.useEffect(() => {
        getTeachers();
        console.log(teachers);
    }, []);


    const DisplayData = teachers.map(
        (info) => {
            return (
                <tr>
                    <td>{info.firstName}</td>
                    <td>{info.secondName}</td>
                    <td>{info.school.name}</td>
                    <td>{info.username}</td>
                    <td>{info.phoneNumber}</td>
                </tr>
            )
        }
    )

    return (
        <div className="table-responsive mt-2" style={{margin: "10px"}}>
            <table className="table table-striped">
                <thead>
                <tr>
                    <th>Jméno</th>
                    <th>Příjmení</th>
                    <th>Škola</th>
                    <th>E-mail</th>
                    <th>Telefon</th>
                </tr>
                </thead>
                <tbody>
                {DisplayData}
                </tbody>
            </table>

        </div>
    )
}

export default ShowTeachers;