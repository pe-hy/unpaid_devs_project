import axios from "axios";
import React, {Component} from "react";
import {BsEnvelopeFill, BsExclamationCircleFill, BsExclamationTriangleFill, BsLockFill} from "react-icons/bs";
import {Navigate} from "react-router-dom";
import CheckButton from "react-validation/build/button";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import AuthService from "../../../../services/AuthService";
import {userContext} from "../../../../userContext";
import "./LoginFormStyles.css";
import ChangePasswordComponent from "../../changePassword/ChangePasswordComponent";
import ForgotPasswordEmail from "../../forgotPassword/ForgotPasswordEmail";

const URL = `${process.env.REACT_APP_AXIOS_URL}`;

const CONFIRMATION_URL = `${URL}/register/confirm?`;

const validateEmail = (email) => {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
};

const required = (value) => {
    if (!value) {
        return (
            <div className="alert my-alert text-bold" role="alert">
                <BsExclamationCircleFill/> Toto pole je povinné!
            </div>
        );
    }
};
const invalidEmail = (value) => {
    if (!validateEmail(value)) {
        return (
            <div className="alert alert-danger my-alert text-bold" role="alert">
                <BsExclamationTriangleFill/> Špatný formát e-mailu!
            </div>
        );
    }
};

export default class Login extends Component {
    static contextType = userContext;

    constructor(props) {
        super(props);
        this.handleLogin = this.handleLogin.bind(this);
        this.onChangeEmail = this.onChangeEmail.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.state = {
            username: "",
            password: "",
            loading: false,
            message: "",
            redirectToLogin: false,
            currentRole: null,
            showTokenMessage: false,
        };
    }

    onChangeEmail(e) {
        this.setState({
            username: e.target.value,
        });
    }

    onChangePassword(e) {
        this.setState({
            password: e.target.value,
        });
    }

    componentDidMount(e) {

        if (window.location.href.includes("token")) {
            return axios({
                url: CONFIRMATION_URL + window.location.href.split("?")[1],
                withCredentials: false,
                method: "GET",
            })
                .then(
                    (res) => {
                        this.setState({
                            showTokenMessage: true,
                            message: res.data,
                        });
                    },
                    (error) => {
                        const resMessage =
                            (error.response &&
                                error.response.data &&
                                error.response.data.message) ||
                            error.message ||
                            error.toString();
                        this.setState({
                            showTokenMessage: false,
                            loading: false,
                            message: resMessage,
                        });
                    }
                );


        } else {

        }

    }

    handleLogin(e) {
        e.preventDefault();
        //Use something like this to check renderering, but after everything is fetched from the server
        // Uncomment this below and add proper error handling for servercall
        this.form.validateAll();
        if (this.checkBtn.context._errors.length === 0) {
            AuthService.login(this.state.username, this.state.password).then(
                (res) => {
                    this.context.logIn(true);
                    this.setState({
                        currentRole: localStorage.getItem("role"),
                        redirectToLogin: true,
                    });

                },
                (error) => {
                    const resMessage =
                        (error.response &&
                            error.response.data &&
                            error.response.data.message) ||
                        error.message ||
                        error.toString();
                    this.setState({
                        loading: false,
                        message: resMessage,
                    });
                }
            );
        } else {
            this.setState({
                loading: false,
            });
        }
    }

    render() {
        //Use similar logic like this
        if (this.state.redirectToLogin && this.state.currentRole === "ROLE_STUDENT")
            return <Navigate to="/studentHome"/>;
        if (this.state.redirectToLogin && this.state.currentRole === "ROLE_TEACHER")
            return <Navigate to="/teacherHome"/>;
        if (this.state.redirectToLogin && this.state.currentRole === "ROLE_COORDINATOR")
            return <Navigate to="/coordinatorHome"/>;
        if (this.state.redirectToLogin && this.state.currentRole === "ROLE_ADMIN")
            return <Navigate to="/adminHome"/>;
        return (
            <div className="col-md-12 container-login">
                <p className="thick ">PŘIHLÁŠENÍ</p>
                <div className="card card-container form-cointainer">
                    <Form
                        onSubmit={this.handleLogin}
                        ref={(c) => {
                            this.form = c;
                        }}
                    >
                        <div className="form-group form-cointainer">
                            <label htmlFor="username" className="text-bold text-padding">
                                E-mail
                            </label>
                            <div className="inner-addon left-addon">
                                <i className="glyphicon glyphicon-user icon-form">
                                    <BsEnvelopeFill/>
                                </i>
                                <Input
                                    type="text"
                                    className="form-control"
                                    name="username"
                                    placeholder="example@osu.cz"
                                    value={this.state.username}
                                    onChange={this.onChangeEmail}
                                    validations={[required, invalidEmail]}
                                />
                            </div>
                        </div>
                        <div className="form-group form-cointainer">
                            <label htmlFor="password" className="text-bold text-padding">
                                Heslo
                            </label>
                            <div className="inner-addon left-addon">
                                <i className="glyphicon glyphicon-user icon-form">
                                    <BsLockFill/>
                                </i>
                                <Input
                                    type="password"
                                    className="form-control"
                                    name="password"
                                    placeholder="heslo"
                                    value={this.state.password}
                                    onChange={this.onChangePassword}
                                    validations={[required]}
                                />
                            </div>
                        </div>
                        <span className={"float-end mt-2 forgot-pswrd"}><ForgotPasswordEmail/>
                        </span>
                        <div className="form-group button-login pt-5">
                            {this.state.message && !this.state.showTokenMessage && (
                                <div className="alert alert-danger my-alert1 text-bold" role="alert">
                                    <BsExclamationTriangleFill className={"alert-icon"}/>{this.state.message}
                                </div>
                            )}
                            {this.state.showTokenMessage && (
                                <div className="alert alert-success text-bold" role="alert">
                                    <BsExclamationTriangleFill className={"alert-icon"}/>{this.state.message}
                                </div>
                            )}
                            <button
                                className="btn button-lg"
                                disabled={this.state.loading}
                            >
                                {this.state.loading && (
                                    <span className="spinner-border spinner-border-sm"></span>
                                )}
                                <span className="text-bold">Přihlásit se</span>
                            </button>
                        </div>
                        <a href="register" className={"d-flex justify-content-center mt-2 rgstr"}>Zaregistrovat se</a>
                        <CheckButton
                            style={{display: "none"}}
                            ref={(c) => {
                                this.checkBtn = c;
                            }}
                        />
                    </Form>
                </div>
            </div>
        );
    }
}