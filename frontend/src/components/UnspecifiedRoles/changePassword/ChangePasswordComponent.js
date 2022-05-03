import React from "react";
import {Modal, OverlayTrigger, Tooltip} from "react-bootstrap";
import {BsExclamationCircleFill, BsExclamationTriangleFill, BsInfoCircleFill} from "react-icons/bs";
import PasswordStrengthBar from 'react-password-strength-bar';
import CheckButton from "react-validation/build/button";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import Select from "react-validation/build/select";
import {axios} from "../../../axios";
import AuthService from "../../../services/AuthService";
import "./ChangePasswordComponent.css";


const URL = `${process.env.REACT_APP_AXIOS_URL}`;

const POST_PASSWORD_CHANGE = `${URL}/changePassword`;

const validatePassword = (password) => {
    const format = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    if (password.length < 6) return "Příliš krátké heslo!"
    if (!/[A-Za-z]/.test(password)) return "Heslo neobsahuje znak abecedy!"
    if (!/\d/.test(password)) return "Heslo neobsahuje číslo!"
    if (!format.test(password)) return "Heslo neobsahuje speciální znak!"
}

const {Component} = React;

const required = (value) => {
    if (!value) {
        return (
            <div className="alert my-alert text-bold" role="alert">
                <BsExclamationCircleFill/> Toto pole je povinné!
            </div>
        );
    }
};

const invalidPassword = (value) => {
    if (validatePassword(value)) {
        return (
            <div className="alert alert-danger my-alert text-bold" role="alert">
                <BsExclamationTriangleFill/> {validatePassword(value)}
            </div>
        );
    }
};

export class ChangePasswordComponent extends Component {
    constructor(props) {
        super(props);
        this.oldPasswordRef = React.createRef();
        this.passwordRef = React.createRef();
        this.passwordAgainRef = React.createRef();
        this.state = {
            secondPassword: "",
            password: "",
            oldPassword: "",
            modalShow: false,
            alert: "",
            alertIsErr: false,
        };
        this.handlePasswordReset = this.handlePasswordReset.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.onChangePasswordSecond = this.onChangePasswordSecond.bind(this);
        this.onChangePasswordNew = this.onChangePasswordNew.bind(this);
        this.checkSecondPassword = this.checkSecondPassword.bind(this);
    }


    checkSecondPassword(e) {
        if (e !== this.state.password) {
            return (
                <div className="alert alert-danger my-alert text-bold" role="alert">
                    <BsExclamationTriangleFill/> Hesla nesouhlasí!
                </div>
            );
        }
    }

    handlePasswordReset(e) {
       console.log("form with password", e);
        e.preventDefault();
        this.form.validateAll();
        if (this.checkBtn.context._errors.length === 0) {
            AuthService.changePassword(this.state.oldPassword, this.state.password).then((res) =>{
                    this.setState({
                        alert: res,
                        alertIsErr: false
                    });
            },
                (error) => {
                    this.setState({
                        alert: error.response.data,
                        alertIsErr: true
                    });
                });
            return true;
        }
    }

    onChangePassword(e) {
        this.setState({
            oldPassword: e.target.value,
        });
    }

    onChangePasswordNew(e) {
        this.setState({
            password: e.target.value,
        });
    }

    onChangePasswordSecond(e) {
        this.setState({
            secondPassword: e.target.value,
        });
    }

    CreateModal(props) {
        return (
            <Modal
                {...props}
                show={this.state.modalShow}
                onHide={() => this.setState({modalShow: false})}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                </Modal.Header>
                <Modal.Body>
                    <h4>Změna hesla</h4>
                    <Form
                        className="mt-5"
                        id="changePasswordForm"
                        onSubmit={this.handlePasswordReset}
                          ref={(c) => {
                              this.form = c;
                          }}>
                        <label className={"label-setting"}>
                            <span className="span-label">
                            <b>Staré heslo</b>
                        </span>

                            <span className={"span-input mb-5"}>
                  <Input type="password"
                         ref={this.oldPasswordRef}
                         className="form-control"
                         placeholder="Staré heslo"
                         validations={[required]}
                         onChange={this.onChangePassword}
                         value={this.state.oldPassword}
                         required/>
                </span>
                        </label>
                        <label className={"label-setting"}>
                <span className={"span-label"}>
                  <OverlayTrigger
                      overlay={
                          <Tooltip>
                              Heslo musí být alespoň 6 znaků dlouhé. Heslo musí obsahovat alespoň 1 písmeno, 1 číslo a 1
                              speciální znak.
                          </Tooltip>
                      }
                  >
                    <span>
                      <BsInfoCircleFill className={"info-tooltip"}/>
                    </span>
                  </OverlayTrigger>
                  <b>Nové heslo</b>
                </span>
                            <span className={"span-input"}>
                  <div className="inner-addon right-addon">

                    <Input type="password"
                           className="form-control"
                           ref={this.passwordRef}
                           onChange={this.onChangePasswordNew}
                           value={this.state.password}
                           validations={[required, invalidPassword]}
                           required/></div>
                </span>
                        </label>
                        <br/>
                        <span className={"password-strength"}>
                <PasswordStrengthBar className={"password"}
                                     minLength={6}
                                     scoreWords={['', '', '', '']}
                                     shortScoreWord={""}
                                     password={this.state.password}/>
              </span>

                        <label className={"label-setting"}>
                            <span className={"span-input"}></span>

                            <span className={"span-input"}>
                  <Input type="password"
                         ref={this.passwordAgainRef}
                         className="form-control"
                         placeholder="Nové heslo znovu"
                         onChange={this.onChangePasswordSecond}
                            value={this.state.secondPassword}
                         validations={[required, this.checkSecondPassword]}
                         required/>
                </span>
                        </label>
                        <br/>
                        <CheckButton
                            style={{display: "none"}}
                            ref={(c) => {
                                this.checkBtn = c;
                            }}
                        />
                    </Form>


                </Modal.Body>
                <Modal.Footer>
                    <button type="button" className="accept-btn my-btn-white"
                            onClick={() => this.setState({modalShow: false})}>Storno
                    </button>
                    <button form="changePasswordForm" className="accept-btn"
                            onClick={() => {
                                if (this.checkBtn.context._errors.length === 0){this.setState({modalShow: false});}
                                
                            }}>Změnit heslo
                    </button>
                </Modal.Footer>
            </Modal>
        )
            ;
    }
    renderAlert() {
        if (this.state.alert) {
            if (!this.state.alertIsErr){
                return (
                    <div className="alert alert-success center" role="alert">
                        {this.state.alert}
                    </div>
                );
            }
            else{
                return (
                    <div className="alert alert-danger center" role="alert">
                        {this.state.alert}
                    </div>
                );
            }
        }
    }

    render() {
        return (
            <span>
                    <button type="button" className="change-btn"
                            onClick={() => this.setState({modalShow: true})}>Změnit heslo
                    </button>
                {this.CreateModal()}
                <div className="center">
                    <div className="mt-4 w-75">{this.renderAlert()}</div>
                </div>
            </span>
        )
    }
}

export default ChangePasswordComponent