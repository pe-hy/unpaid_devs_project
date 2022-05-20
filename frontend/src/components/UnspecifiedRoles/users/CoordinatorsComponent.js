import React from 'react'
import {axios} from "../../../axios";

const URL = `${process.env.REACT_APP_AXIOS_URL}`;

const GET_COORDINATORS_URL = `${URL}/user/coordinators`;

function ShowCoordinators() {

    //create const for teachers
    const [coordinators, setCoordinators] = React.useState([]);

    //create UseEffect
    const getStudents = async () => {
        const response = await axios({
            url: GET_COORDINATORS_URL,
            withCredentials: true,
            method: "GET",
        }).then((response) => {
            response.data.forEach(element => coordinators.push(element.name));
            setCoordinators(response.data);
        });
    };

    const formatPhoneNum = (number) => {
        if(number === null || number === "") return;
        let ret = number.replaceAll(" ", "");
        let formattedNum = "";
        let index = 0;

        if (ret.substring(0,4) === "+420") {
            formattedNum = formattedNum.concat("+420 ");
            index += 4;
        }
        for (let i = 0; i < 3; i++) {
            formattedNum = formattedNum.concat(ret.substring(index, index + 3));
            if (i < 2) { formattedNum = formattedNum.concat(" "); }
            index += 3;
        }

        return formattedNum;
    }

    React.useEffect(() => {
        getStudents();
        console.log(coordinators);
    }, []);


    const DisplayData = coordinators.map(
        (info) => {
            return (
                <tr>
                    <td>{info.firstName}</td>
                    <td>{info.secondName}</td>
                    <td>{info.username}</td>
                    <td>{info.phoneNumber.length != 0 ? formatPhoneNum(info.phoneNumber) : "-"}</td>
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

export default ShowCoordinators;