import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { BsExclamationCircleFill, BsExclamationTriangleFill, BsInfoCircleFill } from "react-icons/bs";
import PasswordStrengthBar from 'react-password-strength-bar';
import CheckButton from "react-validation/build/button";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import Select from "react-validation/build/select";
import { axios } from "../../../axios";
import AuthService from "../../../services/AuthService";
import FinishedRegistrationComponent from "../../UnspecifiedRoles/registration/registrationButton/FinishedRegistrationComponent";
import RegistrationButtonComponent from "../../UnspecifiedRoles/registration/registrationButton/RegistrationButtonComponent";
import "../../UnspecifiedRoles/registration/RegistrationComponent.css";

const notRegistered = "Zaregistrovat koordinátora";
const waiting = "Zpracování požadavku..."
const finished = "Na e-mail bylo zasláno ověření";

const URL = `${process.env.REACT_APP_AXIOS_URL}`;

const GET_SCHOOLS_URL = `${URL}/register/schools`;

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

const invalidPhoneNum = (value) => {
    if (!validatePhoneNum(value)) {
        return (
            <div className="alert alert-danger my-alert text-bold" role="alert">
                <BsExclamationTriangleFill /> Špatný formát telefonního čísla!
            </div>
        );
    }
};


const getButton = (isRegistered, registerOnClick, disable, btnMessage) => {
    if (!isRegistered) {
        return (
            <RegistrationButtonComponent
                text={btnMessage}
                click={registerOnClick}
            />
        );
    } else {
        return (
            <RegistrationButtonComponent
                text={"Zaregistrovat koordinátora"}
                click={registerOnClick}
            />
        );
    }
};


const validatePassword = (password) => {
    const format = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    if (password.length < 6) return "Příliš krátké heslo!"
    if (!/[A-Za-z]/.test(password)) return "Heslo neobsahuje znak abecedy!"
    if (!/\d/.test(password)) return "Heslo neobsahuje číslo!"
    if (!format.test(password)) return "Heslo neobsahuje speciální znak!"
}

const { Component } = React;

const required = (value) => {
    if (!value) {
        return (
            <div className="alert my-alert text-bold" role="alert">
                <BsExclamationCircleFill /> Toto pole je povinné!
            </div>
        );
    }
};

const invalidPassword = (value) => {
    if (validatePassword(value)) {
        return (
            <div className="alert alert-danger my-alert text-bold" role="alert">
                <BsExclamationTriangleFill /> {validatePassword(value)}
            </div>
        );
    }
};

export class RegistrationComponent extends Component {
    constructor(props) {
        super(props);
        this.emailRef = React.createRef();
        this.nameRef = React.createRef();
        this.lastNameRef = React.createRef();
        this.passwordRef = React.createRef();
        this.passwordAgainRef = React.createRef();
        this.phoneRef = React.createRef();
        this.state = {
            email: "",
            message_success: "",
            name: "",
            surname: "",
            school: null,
            telephone: null,
            secondPassword: "0000",
            password: "0000",
            message: "",
            schoolList: [],
            redirectToLogin: false,
            studentChecked: true,
            isRegistered: false,
            disable: false,
            btnMessage: notRegistered,
        };
        this.onChangeEmail = this.onChangeEmail.bind(this);
        this.handleRegister = this.handleRegister.bind(this);
        this.onChangeName = this.onChangeName.bind(this);
        this.onChangeSurname = this.onChangeSurname.bind(this);
        this.validateEmail = this.validateEmail.bind(this);
        this.invalidEmail = this.invalidEmail.bind(this);
    }

    validateEmail(email) {

        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );

    };

    invalidEmail(value) {
        if (!this.validateEmail(value)) {
            return (
                <div className="alert alert-danger my-alert text-bold" role="alert">
                    <BsExclamationTriangleFill /> Špatný formát e-mailu!
                </div>
            );
        }
    };

    handleRegister(e) {
        console.log("handling register")
        //Use something like this to check renderering, but after everything is fetched from the server
        // Uncomment this below and add proper error handling for servercall
        e.preventDefault();
        this.form.validateAll();
        if (this.checkBtn.context._errors.length === 0) {

            this.setState({
                disable: true,
                btnMessage: waiting,
            });
            AuthService.registerCoordinator(this.state.email, this.state.name, this.state.surname, this.state.password, "coordinator").then(
                (res) => {
                    console.log("Server Message:", res)
                    this.setState({
                        isRegistered: true,
                        message_success: res,
                    });
                },
                (error) => {
                    const resMessage = error.response.data.message.split(":")[1];
                        error.toString();
                    console.log("Server Error Message:", resMessage)
                    this.setState({
                        loading: false,
                        message: resMessage,
                        disable: false,
                        btnMessage: notRegistered,
                    });
                }
            );
        } else {

        }
    }

    onChangeEmail(e) {
        this.setState({
            message: "",
            email: e.target.value,
        });
    }

    onChangeName(e) {
        this.setState({
            message: "",
            name: e.target.value,
        });
    }

    onChangeSurname(e) {
        this.setState({
            message: "",
            surname: e.target.value,
        });
    }

    render() {

        return (
            <div className={"container-registration"}>
                <div>

                    <p className="thick">
                        <OverlayTrigger
                            overlay={
                                <Tooltip>
                                    Po přidání nového koordinátora si koordinátor musí vytvořit heslo pomocí tlačítka Zapomenuté heslo na stránce přihlášení.
                                </Tooltip>
                            }
                        >
                    <span>
                      <BsInfoCircleFill className={"info-tooltip"}/>
                    </span>
                        </OverlayTrigger>
                        PŘIDÁNÍ KOORDINÁTORA</p>
                </div>

                <section className={" card card-container form-cointainer d-flex justify-content-center mt-2"}>
                    <Form onSubmit={this.handleRegister}
                        ref={(c) => {
                            this.form = c;
                        }}
                    >
                        <br />

                        <label className={"label-setting"}>
                            <span className={"span-label"}> <b>E-mail</b></span>
                            <span className={"span-input"}>
                                <Input type="email"
                                    className="form-control"
                                    ref={this.emailRef}
                                    name={this.emailRef}
                                    value={this.state.email}
                                    onChange={this.onChangeEmail}
                                    validations={[required, this.invalidEmail]}
                                    required />
                            </span>
                        </label>
                        <br />

                        <label className={"label-setting"}>
                            <span className={"span-label"}><b>Jméno</b></span>
                            <span className={"span-input"}>
                                <Input type="text"
                                    onChange={this.onChangeName}
                                    className="form-control"
                                    name={this.nameRef}
                                    ref={this.nameRef}

                                    required />
                            </span>
                        </label>
                        <br />


                        <label className={"label-setting"}>
                            <span className={"span-label"}><b>Příjmení</b></span>
                            <span className={"span-input"}>
                                <Input type="text"
                                    ref={this.lastNameRef}
                                    onChange={this.onChangeSurname}
                                    className="form-control"
                                    name={this.lastNameRef}

                                    required />
                            </span>
                        </label>
                        <br />
                        {this.state.message && (
                            <div className="alert alert-danger my-alert1 text-bold" role="alert">
                                <BsExclamationTriangleFill className={"alert-icon"} />{this.state.message}
                            </div>
                        )}
                        {this.state.message_success && (
                            <div className="alert alert-success center text-bold" role="alert">
                                <BsExclamationTriangleFill className={"alert-icon"} />{this.state.message_success}
                            </div>
                        )}


                        <div className={"btn-align-center"}>
                            {getButton(this.state.isRegistered, this.handleRegister, this.state.disable, this.state.btnMessage)}
                        </div>

                        <CheckButton
                            style={{ display: "none" }}
                            ref={(c) => {
                                this.checkBtn = c;
                            }}
                        />
                    </Form>

                </section>
            </div>
        );
    }
}

export default RegistrationComponent