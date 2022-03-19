import ReactDOM from "react-dom";
import React from "react";
import Form from "react-validation/build/form";
import AuthService from "../../services/AuthService";
import CheckButton from "react-validation/build/button";
import {OverlayTrigger, Tooltip} from "react-bootstrap";
import "./RegistrationComponent.css";
import {BsFillEyeFill, BsFillEyeSlashFill} from "react-icons/bs";
import {BsInfoCircleFill} from "react-icons/bs";

const { Component } = React;

export class RegistrationComponent extends Component {
    constructor(props) {
        super(props);
        this.handleRegister = this.handleRegister.bind(this);
        this.onChangeOccupation = this.onChangeOccupation(this)
        this.onChangeEmail = this.onChangeEmail.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.state = {
            email: "",
            name: "",
            surname: "",
            school: "",
            telephone: "",
            password: "",
            occupation: "student",
            message: "",
            redirectToLogin: false,
        };
      }

    componentDidMount() {
        ReactDOM.findDOMNode(this.refs.name).focus();
    }

    handleRegister(e) {
        e.preventDefault();
        //Use something like this to check renderering, but after everything is fetched from the server
        // Uncomment this below and add proper error handling for servercall
        this.form.validateAll();
        if (this.checkBtn.context._errors.length === 0) {
          AuthService.register(this.state.email, this.state.name, this.state.surname, this.state.school, this.state.telephone, this.state.password).then(
            (res) => {
                console.log("Server Message:", res)
              this.setState({
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

      onChangeEmail(e) {
        this.setState({
            email: e.target.value,
          });
      }

      onChangeOccupation(e) {
       
        console.log("occupation")
      }

      onChangePassword(e) {
        this.setState({
            password: e.target.value,
          });
      }

    render() {
        return (
            <div className={"container-registration"}>
                <div>
                    <p className="thick">REGISTRACE</p>
                </div>
            <section className={" card card-container form-cointainer d-flex justify-content-center mt-2"} >
                <Form onSubmit={this.handleRegister}
                ref={(c) => {
                    this.form = c;
                    }}
                >
                    <br/>
                    <div className={"d-flex justify-content-around mt-2 radio-group"}>
                        <div>
                            <input type="radio" id="student" name="occupation" value="student" checked onChange={this.onChangeOccupation}/>
                            <label for="student">Student</label>
                        </div>
                        <div>
                            <input type="radio" id="teacher" name="occupation" value="učitel"/>
                            <label for="teacher">Učitel</label>
                        </div>
                    </div>
                    <br/><br/>

                    <label className={"label-setting"}>
                        <span className={"span-label"}> <b>E-mail</b></span>
                        <span className={"span-input"}>
                            <input  type="email"
                                    className="form-control"
                                    ref="email"
                                    defaultValue=""
                                    required />
                        </span>
                    </label>
                    <br/>

                    <label className={"label-setting"}>
                        <span className={"span-label"}><b>Jméno</b></span>
                            <span className={"span-input"}>
                                <input  type="text"
                                        className="form-control"
                                        ref="name"
                                        defaultValue=""
                                        required />
                            </span>
                    </label>
                    <br/>


                    <label className={"label-setting"}>
                        <span className={"span-label"}><b>Příjmení</b></span>
                           <span className={"span-input"}>
                               <input  type="text"
                                       ref="name"
                                       className="form-control"
                                       defaultValue=""
                                       required />
                           </span>
                    </label>
                    <br/>


                    <label className={"label-setting"}>
                        <span className={"span-label"}><b>Škola</b>
                        <OverlayTrigger
                            overlay={
                                <Tooltip>
                                    Pokud nevidíte školu ve které vyučujete, kontaktujte koordinátora.
                                </Tooltip>
                            }
                        >
                  <span>
                    <BsInfoCircleFill className={"info-tooltip"}/>
                  </span>
                        </OverlayTrigger>
                        </span>
                        <span className={"span-input"}>
                        <select name="school" id="school" className="form-control" placeholder="Vyberte školu">
                            <option value='default' disabled={true}>Vyberte Školu</option>
                            <option value="volvo">Gymnázium Ostrava 1</option>
                            <option value="saab">Frýdek-Místek Cihelní</option>
                            <option value="mercedes">Čeladná ZŠ</option>
                            <option value="audi">Frýdek-Místek 6.</option>
                        </select>
                        </span>

                    </label>
                    <br/>

                    <label className={"label-setting"}>
                        <span className={"span-label"}>Telefon</span>
                        <span className={"span-input"}>
                        <input  type="tel"
                                className="form-control"
                                ref="phone"
                                defaultValue=""
                                required /></span>
                    </label>
                    <br/>

                    <label className={"label-setting"}>
                        <span className={"span-label"}><b>Heslo</b></span>
                        <span className={"span-input"}>
                            <div className="inner-addon right-addon">
                            <i className="glyphicon glyphicon-user icon-form">
                  <BsFillEyeFill />
                </i>
                            <input  type="password"
                                    className="form-control"
                                    ref="password"
                                    defaultValue=""
                                    required /></div>
                        </span>
                    </label>
                    <br/>

                    <label className={"label-setting"}>
                        <span className={"span-input"}></span>
                        <span className={"span-input"}>
                            <input  type="password"
                                    ref="password_again"
                                    className="form-control"
                                    defaultValue=""
                                    placeholder="Heslo znovu"
                                    required />
                        </span>
                    </label>
                    <br/>


                    <div className={"btn-align-center"}>
                        <button className="btn button-rgstr"><b>Zaregistrovat se</b></button>
                    </div>

                    <CheckButton
                        style={{ display: "none" }}
                        ref={(c) => {
                            this.checkBtn = c;
                        }}
                    />
                </Form>

                <br/>
                <span className={"account-a"}>
                    <p>Máte účet?   <a className={"login-link"} href = "login">Přihlašte se</a>
                    </p>
                </span>
            </section>
            </div>
        );
    }
}
export default RegistrationComponent