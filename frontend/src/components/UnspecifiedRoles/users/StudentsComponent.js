import React from 'react'
import {axios} from "../../../axios";

const URL = `${process.env.REACT_APP_AXIOS_URL}`;

const GET_STUDENTS_URL = `${URL}/user/students`;

function ShowStudents() {

    //create const for teachers
    const [students, setStudents] = React.useState([]);

    //create UseEffect
    const getStudents = async () => {
        const response = await axios({
            url: GET_STUDENTS_URL,
            withCredentials: true,
            method: "GET",
        }).then((response) => {
            response.data.forEach(element => students.push(element.name));
            setStudents(response.data);
        });
    };

    React.useEffect(() => {
        getStudents();
        console.log(students);
    }, []);


    const DisplayData = students.map(
        (info) => {
            return (
                <tr>
                    <td>{info.firstName}</td>
                    <td>{info.secondName}</td>
                    <td>{info.username}</td>
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
                    <th>E-mail</th>
                </tr>
                </thead>
                <tbody>
                {DisplayData}
                </tbody>
            </table>

        </div>
    )
}

export default ShowStudents;