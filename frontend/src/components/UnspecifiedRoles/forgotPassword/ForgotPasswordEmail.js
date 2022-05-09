import React from "react";
import {Modal} from "react-bootstrap";
import {BsExclamationCircleFill, BsExclamationTriangleFill} from "react-icons/bs";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import AuthService from "../../../services/AuthService";
import "./ForgotPasswordEmail.css";
import CheckButton from "react-validation/build/button";


const URL = `${process.env.REACT_APP_AXIOS_URL}`;

const {Component} = React;

const required = (value) => {
    if (!value) {
        return (<div className="alert my-alert text-bold" role="alert">
            <BsExclamationCircleFill/> Toto pole je povinné!
        </div>);
    }
};

export class ForgotPasswordEmail extends Component {
    constructor(props) {
        super(props);
        this.emailRef = React.createRef();
        this.state = {
            email: "", modalShow: false, alert: "", alertIsErr: false,
            disableButton: false
        };
        this.handleEmailSend = this.handleEmailSend.bind(this);
        this.onChangeEmail = this.onChangeEmail.bind(this);
    }

    handleEmailSend(e) {
        console.log("form with email", e);
        e.preventDefault();
        this.form.validateAll();
        if (this.checkBtn.context._errors.length === 0) {
            AuthService.forgotPasswordEmail(this.state.email).then((res) => {
                this.setState({
                    alert: res, alertIsErr: false,
                    disableButton: true
                });
            }, (error) => {
                this.setState({
                    alert: error.response.data, alertIsErr: true,
                    disableButton: true
                });
            });
            return true;
        }
    }

    onChangeEmail(e) {
        this.setState({
            email: e.target.value,
        });
    }

    CreateModal(props) {
        return (<Modal
            {...props}
            show={this.state.modalShow}
            onHide={() => this.setState({modalShow: false, disableButton: false})}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
            </Modal.Header>
            <Modal.Body>
                <h4>Zapomenuté heslo</h4>
                <Form
                    className="mt-5"
                    id="changePasswordForm"
                    onSubmit={this.handleEmailSend}
                    ref={(c) => {
                        this.form = c;
                    }}>
                    <label className={"label-setting"}>
                            <span className="span-label">
                            <b>Váš E-mail</b>
                        </span>

                        <span className={"span-input mb-5"}>
                  <Input type="text"
                         ref={this.emailRef}
                         className="form-control"
                         placeholder="Jan.Novak@email.cz"
                         validations={[required]}
                         onChange={this.onChangeEmail}
                         value={this.state.email}
                         required/>
                </span>
                    </label>
                    <CheckButton
                        style={{display: "none"}}
                        ref={(c) => {
                            this.checkBtn = c;
                        }}
                    />
                </Form>
                <div className="center">
                <div className="w-75">
                {this.renderAlert()}
                </div>
                </div>
                </Modal.Body>
            <Modal.Footer>
                <button type="button" className="accept-btn my-btn-white"
                        onClick={() => this.setState({modalShow: false})}>Storno
                </button>
                <button disabled={this.state.disableButton} id={"btn_modal"} form="changePasswordForm"
                        className="accept-btn"
                        onClick={() => {
                            if (this.checkBtn.context._errors.length === 0) {
                                if (document.getElementById("btn_modal")) {
                                    document.getElementById("btn_modal").disabled = this.state.disableButton;
                                    document.getElementById("btn_modal").className = "btn_modal";
                                    document.getElementById("btn_modal").innerText = "Odesláno";
                                }
                            }
                        }
                        }>Odeslat
                </button>
            </Modal.Footer>
        </Modal>);
    }

    renderAlert() {
        if (this.state.alert) {
            if (!this.state.alertIsErr) {
                return (<div className="alert alert-success center" role="alert">
                    {this.state.alert}
                </div>);
            } else {
                return (<div className="alert alert-danger center" role="alert">
                    {this.state.alert}
                </div>);
            }
        }
    }

    render() {
        return (
            <span>
                    <button type="button" className="change-btn"
                            onClick={() => this.setState({modalShow: true})}>Zapomenuté heslo
                    </button>
                {this.CreateModal()}
            </span>

        )
    }
}

export default ForgotPasswordEmail