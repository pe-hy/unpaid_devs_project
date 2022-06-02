import React from 'react'
import {axios} from "../../../axios";
import {Modal} from "react-bootstrap";
import { BsExclamationTriangleFill, BsFillPersonFill, BsPhone, BsTools } from "react-icons/bs";

const URL = `${process.env.REACT_APP_AXIOS_URL}`;

const GET_COORDINATORS_URL = `${URL}/user/coordinators`;
const REMOVE_COORDINATOR_URL = `${URL}/coordinator/deleteCoordinator`;

function ShowCoordinators() {

    //create const for teachers
    const [coordinators, setCoordinators] = React.useState([]);
    const [chosenCoordinatorId, setChosenCoordinatorId] = React.useState();
    const [chosenCoordinatorName, setChosenCoordinatorName] = React.useState("");
    const [modalShow, setModalShow] = React.useState(false);
    const [successMessage, setSuccessMessage] = React.useState("");
    const [errorMessage, setErrorMessage] = React.useState("");

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

    const removeCoordinator = async () => {
        const response = await axios({
            headers: {'content-type': 'application/json'},
            url: REMOVE_COORDINATOR_URL,
            withCredentials: true,
            method: "POST",
            data: chosenCoordinatorId,
        }).catch((err) => {
            console.log(err.response.data.message);
            setErrorMessage(err.response.data.message.split(":")[1]);
        });
        if (response && response.data) {
            getStudents();
        }
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
                    <h4>Smazání koordinátora</h4>
                    <p>
                        Jste si skutečně jisti, že chcete smazat tohoto koordinátora?
                    </p>
                    <b>
                        - {chosenCoordinatorName} -
                    </b>
                </Modal.Body>
                <Modal.Footer>
                    <button type="button" className="accept-btn my-btn-white" onClick={props.onHide}>Storno</button>
                    <button type="button" className="removal-btn" onClick={() => {props.onHide(); removeCoordinator();}}>Smazat</button>
                </Modal.Footer>
            </Modal>
        );
    }


    const DisplayData = coordinators.map(
        (info) => {
            return (
                <tr>
                    <td>{info.firstName}</td>
                    <td>{info.secondName}</td>
                    <td>{info.username}</td>
                    <td>{info.phoneNumber != null && info.phoneNumber.length != 0 ? formatPhoneNum(info.phoneNumber) : "-"}</td>
                    {localStorage.getItem("role") === "ROLE_COORDINATOR" ? (errorMessage && chosenCoordinatorId == info.id) ? <td><span className="center text-bold" role="alert">
                                    <BsExclamationTriangleFill style={{marginRight: "5px"}} /> {errorMessage}</span></td>
                                 : <td><button className="removal-btn-3" onClick={() => {setChosenCoordinatorId(info.id);setChosenCoordinatorName(info.firstName + " " + info.secondName);setModalShow(true)}}>X</button></td> : ""}
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
            <CreateModal
                show={modalShow}
                onHide={() => setModalShow(false)}
            />
        </div>
    )
}

export default ShowCoordinators;