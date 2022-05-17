import React, {useEffect, useState} from 'react';
import {axios} from "../../../axios";
import "./CoordinatorPersonalPageComponent.css";
import {BsAt, BsExclamationTriangleFill, BsFillPersonFill, BsPhone, BsTools} from "react-icons/bs";
import ChangePasswordComponent from "../../UnspecifiedRoles/changePassword/ChangePasswordComponent";

const URL = `${process.env.REACT_APP_AXIOS_URL}`;
const POST_PHONE_EDIT = `${URL}/coordinator/changePhoneNumber`;
const GET_DATA_URL = `${URL}/user/data`;

const CoordinatorPersonalPageComponent = () => {
    let iconStyles = {fontSize: "1.35em", marginRight: "10px"};
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [phoneNew, setPhoneNew] = useState("");
    const getUserData = async () => {
        // Make first two requests
        const response = await Promise.all([
            axios({
                url: GET_DATA_URL,
                withCredentials: true,
                method: "GET",
            }),
        ]);

        // Update state once with all 3 responses
        setName((response[0].data.firstName + " " + response[0].data.secondName));
        setEmail(response[0].data.username);
        setPhone(response[0].data.phoneNumber);
    };

    useEffect(() => {
        getUserData();
    }, []);

    const invalidPhoneNum = (value) => {
        if (!validatePhoneNum(value)) {
            return (
                <div className="alert alert-danger my-alert text-bold" role="alert">
                    <BsExclamationTriangleFill/> Špatný formát telefonního čísla!
                </div>
            );
        }
    };

    const validatePhoneNum = (number) => {
        if (number === "") {
            return true;
        }
        return String(number)
            .toLowerCase()
            .match(
                /^(\+420)? ?[1-9][0-9]{2} ?[0-9]{3} ?[0-9]{3}$/
            );
    }



    const editPhone = async () => {
        const response = await axios({
            headers: {'content-type': 'application/json'},
            url: POST_PHONE_EDIT,
            withCredentials: true,
            method: "POST",
            data: phoneNew,
        }).catch((err) => {
            alert(err.response.data.message);
            console.log(err.response.data.message);
        });
        if (response && response.data) {
            getUserData();
        }
    };

    return (
        <div style={{marginTop: "30px"}}>
            <div className="row">
                <div className="col-sm">
                    <h1>Osobní stránka</h1>
                    <p style={{paddingTop: "25px"}}><BsFillPersonFill style={iconStyles}/><b>Jméno:</b> {name}</p>
                    <p><b><BsAt style={iconStyles}/>E-mail:</b> {email}</p>
                    <div className="container">
                        <div className="row">
                            <div className="col-sm-4"><b><BsPhone style={iconStyles}/>Telefon</b>: {phone}</div>
                            <form onSubmit={(e) => {
                                e.preventDefault();
                                editPhone();
                            }}>
                                <div className="col-sm-4 mt-3">
                                    <div className="form-group">
                                        <input type="text" className="form-control" id="phoneNew"
                                               placeholder="Telefon"

                                               onChange={(e) => {

                                                   setPhoneNew(e.target.value);
                                               }}/>
                                    </div>
                                </div>
                                <div className="col-sm-4 mt-3 mb-3">
                                    <button type="submit" className="change-btn">Změnit telefon</button>
                                </div>
                            </form>
                        </div>
                    </div>
                    <p><b><BsTools style={iconStyles}/>Změna hesla: <ChangePasswordComponent/></b></p>
                </div>
                <div className="col-sm uploadCol"></div>
            </div>
        </div>
    )
}

export default CoordinatorPersonalPageComponent;