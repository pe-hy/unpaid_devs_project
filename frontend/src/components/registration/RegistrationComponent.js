import ReactDOM from "react-dom";
import React, {useEffect, useState} from "react";
import Form from "react-validation/build/form";
import AuthService from "../../services/AuthService";
import CheckButton from "react-validation/build/button";
import Select from "react-validation/build/select";
import {OverlayTrigger, Tooltip} from "react-bootstrap";
import "./RegistrationComponent.css";
import {BsFillEyeFill, BsFillEyeSlashFill} from "react-icons/bs";
import {BsInfoCircleFill} from "react-icons/bs";
import Input from "react-validation/build/input";
import PasswordStrengthBar from 'react-password-strength-bar';
import RegistrationButtonComponent from "../registrationButton/RegistrationButtonComponent";
import FinishedRegistrationComponent from "../registrationButton/FinishedRegistrationComponent"
import {
    BsEnvelopeFill,
    BsLockFill,
    BsExclamationTriangleFill,
    BsExclamationCircleFill
  } from "react-icons/bs";
import {axios} from "../../axios";

const notRegistered = "Zaregistrovat se";
const finished = "Zkontrolujte e-mail";
const [schools, setSchools] = useState([]);
const noSchools = !schools || (schools && schools.length === 0);

  const validatePhoneNum = (number) => {
      if (number === ""){
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

const getButton = (isRegistered) => {
    console.log(isRegistered)
    if (!isRegistered) {
        return (
            <RegistrationButtonComponent
                text={notRegistered}
            />
        );
    } else {
        return (
            <FinishedRegistrationComponent
                text={finished}
            />
        );
    }
};
  

const validatePassword = (password) => {
    const format = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    if(password.length < 6) return "Příliš krátké heslo!"
    if(!/[A-Za-z]/.test(password)) return "Heslo neobsahuje znak abecedy!"
    if(!/\d/.test(password)) return "Heslo neobsahuje číslo!"
    if(!format.test(password)) return "Heslo neobsahuje speciální znak!"
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

const getSchools = async () => {
    const response = await axios({
        url: "http://localhost:8080/user/schools",
        withCredentials: true,
        method: "GET",
    }).catch((err) => {
        alert(err.response.data.message);
        console.log(err.response.data.message);
    });
    if (response && response.data) {
        console.log(response);
        setSchools(response.data);
    }
};

useEffect(() => {
    getSchools();
}, []);

export class RegistrationComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            name: "",
            surname: "",
            school: "school1",
            telephone: "",
            secondPassword: "",
            password: "",
            occupation: "student",
            message: "",
            redirectToLogin: false,
            studentChecked: true,
            isRegistered: false,
        };
        this.handleRegister = this.handleRegister.bind(this);
        this.onChangeOccupation = this.onChangeOccupation.bind(this)
        this.onChangeEmail = this.onChangeEmail.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.checkSecondPassword = this.checkSecondPassword.bind(this);
        this.onChangePhone = this.onChangePhone.bind(this);
        this.onChangeName = this.onChangeName.bind(this);
        this.onChangeSurname = this.onChangeSurname.bind(this);
        this.onChangeSchool = this.onChangeSchool.bind(this);
        this.validateEmail = this.validateEmail.bind(this);
        this.invalidEmail = this.invalidEmail.bind(this);
      }

      checkSecondPassword(e){
        if(e !== this.state.password){
            return (
                <div className="alert alert-danger my-alert text-bold" role="alert">
                  <BsExclamationTriangleFill /> Hesla nesouhlasí!
                </div>
              );
        }
      }
      validateEmail(email){
        if(this.state.occupation === "student"){
            return String(email)
                .toLowerCase()
                .match(
                    /^[A-Za-z0-9._%+-]+@student.osu.cz$/
                );
        }else{
            return String(email)
                .toLowerCase()
                .match(
                    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                );
        }
    };
    invalidEmail(value){
        if (!this.validateEmail(value)) {
            return (
                <div className="alert alert-danger my-alert text-bold" role="alert">
                    <BsExclamationTriangleFill /> Špatný formát e-mailu!
                </div>
            );
        }
    };

    handleRegister(e) {
        e.preventDefault();
        //Use something like this to check renderering, but after everything is fetched from the server
        // Uncomment this below and add proper error handling for servercall
        this.form.validateAll();
        if (this.checkBtn.context._errors.length === 0 || (this.state.occupation === "teacher" && this.checkBtn.context._errors.length <= 1)) { // Don't ask
          AuthService.register(this.state.email, this.state.name, this.state.surname, this.state.school, this.state.telephone, this.state.password, this.state.occupation).then(
            (res) => {
                console.log("Server Message:", res)
                this.setState({
                    isRegistered: true,
                });
            },
            (error) => {
              const resMessage =
                (error.response &&
                  error.response.data &&
                  error.response.data.message) ||
                error.message ||
                error.toString();
                console.log("Server Error Message:", resMessage)
              this.setState({
                loading: false,
                message: resMessage,
              });
            }
          );
        }else{

        }
      }

      onChangeEmail(e) {
        this.setState({
            email: e.target.value,
          });
      }

      onChangeName(e) {
        this.setState({
            name: e.target.value,
          });
      }

      onChangeSurname(e) {
        this.setState({
            surname: e.target.value,
          });
      }

      onChangePhone(e) {
        this.setState({
            telephone: e.target.value,
          });
      }

      onChangeSchool(e) {
        this.setState({
            school: e.target.value,
          });
      }

      onChangePassword(e) {
        
        this.setState({
            password: e.target.value,
          });
      }
      onChangeOccupation(e) {

        this.setState({
          occupation: e.target.value,
        });
    
      }
    render() {
      if(this.state.occupation === "student"){
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
                          <input type="radio" id="student" name="occupation" value="student" onChange={this.onChangeOccupation} defaultChecked/>
                          <label for="student"> Student</label>
                      </div>
                      <div>
                          <input type="radio" id="teacher" name="occupation" value="teacher" onChange={this.onChangeOccupation}/>
                          <label for="teacher"> Učitel</label>
                      </div>
                  </div>
                  <br/><br/>

                  <label className={"label-setting"}>
                      <span className={"span-label"}> <b>E-mail</b>
                          <OverlayTrigger
                              overlay={
                                  <Tooltip>
                                      E-mail musí končit @student.osu.cz.
                                  </Tooltip>
                              }
                          >
                    <span>
                      <BsInfoCircleFill className={"info-tooltip"}/>
                    </span>
                          </OverlayTrigger>
                          </span>

                      <span className={"span-input"}>
                          <Input  type="email"
                                  className="form-control"
                                  ref="email"
                                  defaultValue=""
                                  name="email"
                                  placeholder="P21130@student.osu.cz"
                                  value={this.state.email}
                                  onChange={this.onChangeEmail}
                                  validations={[required, this.invalidEmail]}
                                  required />
                      </span>
                  </label>
                  <br/>

                  <label className={"label-setting"}>
                      <span className={"span-label"}><b>Jméno</b></span>
                          <span className={"span-input"}>
                              <Input  type="text"
                                      className="form-control"
                                      onChange={this.onChangeName}
                                      ref="name"
                                      defaultValue=""
                                      required />
                          </span>
                  </label>
                  <br/>


                  <label className={"label-setting"}>
                      <span className={"span-label"}><b>Příjmení</b></span>
                         <span className={"span-input"}>
                             <Input  type="text"
                                     ref="name"
                                     onChange={this.onChangeSurname}
                                     className="form-control"
                                     defaultValue=""
                                     required />
                         </span>
                  </label>
                  <br/>

                  <label className={"label-setting"}>
                      <span className={"span-label"}><b>Heslo</b>
                                                <OverlayTrigger
                                                    overlay={
                                                        <Tooltip>
                                                            Heslo musí být alespoň 6 znaků dlouhé. Heslo musí obsahovat alespoň 1 písmeno, 1 číslo a 1 speciální znak.
                                                        </Tooltip>
                                                    }
                                                >
                    <span>
                      <BsInfoCircleFill className={"info-tooltip"}/>
                    </span>
                          </OverlayTrigger>
                      </span>
                      <span className={"span-input"}>
                          <div className="inner-addon right-addon">
                          
                          <Input  type="password"
                                  className="form-control"
                                  ref="password"
                                  defaultValue=""
                                  onChange={this.onChangePassword}
                                  validations={[required, invalidPassword]}
                                  required /></div>
                      </span>
                  </label>
                  <br/>
                  <span className={"password-strength"}>
                    <PasswordStrengthBar className={"password"} 
                    minLength={6} 
                    scoreWords={['', '', '', '']} 
                    shortScoreWord={""} 
                    password={this.state.password} />
                  </span>

                  <label className={"label-setting"}>
                      <span className={"span-input"}></span>

                      <span className={"span-input"}>
                          <Input  type="password"
                                  ref="password_again"
                                  className="form-control"
                                  defaultValue=""
                                  placeholder="Heslo znovu"
                                  validations={[required, this.checkSecondPassword]}
                                  required />
                      </span>
                  </label>
                  <br/>


                  <div className={"btn-align-center"}>
                      {getButton(this.state.isRegistered)}
                  </div>

                  <CheckButton
                      style={{ display: "none" }}
                      ref={(c) => {
                          this.checkBtn = c;
                      }}
                  />
              </Form>

              <br/>

              {this.state.message && (
                  <div className="alert alert-danger my-alert1 text-bold" role="alert">
                      <BsExclamationTriangleFill className={"alert-icon"}/>{ this.state.message}
                  </div>
              )}
              <span className={"account-a"}>
                  <p>Máte účet? <a className={"login-link"} href = "login">Přihlašte se</a>
                  </p>
              </span>
          </section>
          </div>
      );
      }
      else{
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
                            <input type="radio" id="student" name="occupation" value="student" onChange={this.onChangeOccupation} defaultChecked/>
                            <label for="student">Student</label>
                        </div>
                        <div>
                            <input type="radio" id="teacher" name="occupation" value="teacher" onChange={this.onChangeOccupation}/>
                            <label for="teacher">Učitel</label>
                        </div>
                    </div>
                    <br/><br/>

                    <label className={"label-setting"}>
                        <span className={"span-label"}> <b>E-mail</b></span>
                        <span className={"span-input"}>
                            <Input  type="email"
                                    className="form-control"
                                    ref="email"
                                    defaultValue=""
                                    name="email"
                                    value={this.state.email}
                                    onChange={this.onChangeEmail}
                                    validations={[required, this.invalidEmail]}
                                    required />
                        </span>
                    </label>
                    <br/>
  
                    <label className={"label-setting"}>
                        <span className={"span-label"}><b>Jméno</b></span>
                            <span className={"span-input"}>
                                <Input  type="text"
                                        onChange={this.onChangeName}
                                        className="form-control"
                                        name="firstName"
                                        ref="name"
                                        defaultValue=""
                                        required />
                            </span>
                    </label>
                    <br/>
  
  
                    <label className={"label-setting"}>
                        <span className={"span-label"}><b>Příjmení</b></span>
                           <span className={"span-input"}>
                               <Input  type="text"
                                       ref="name"
                                       onChange={this.onChangeSurname}
                                       className="form-control"
                                       name="lastName"
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
                          <Select name="school" id="school" onChange={this.onChangeSchool} className="form-control" placeholder="Vyberte školu">
                                        {!noSchools &&
                                          schools.map((item, index) => (
                                              <option value={item.id}>{item.name}</option>
                                         ))}
                          </Select>
                          </span>
  
                      </label>
                      <br/>
  
                      <label className={"label-setting"}>
                          <span className={"span-label"}>Telefon</span>
                          <span className={"span-input"}>
                          <Input  type="text"
                                  className="form-control"
                                  name="telephone"
                                  ref="phone"
                                  onChange={this.onChangePhone}
                                  validations={[invalidPhoneNum]}
                                  defaultValue=""
                          /></span>
                      </label>
                      <br/>
  
                    <label className={"label-setting"}>
                        <span className={"span-label"}><b>Heslo</b>
                                                  <OverlayTrigger
                                                      overlay={
                                                          <Tooltip>
                                                               Heslo musí být alespoň 6 znaků dlouhé. Heslo musí obsahovat alespoň 1 písmeno, 1 číslo a 1 speciální znak.
                                                          </Tooltip>
                                                      }
                                                  >
                    <span>
                      <BsInfoCircleFill className={"info-tooltip"}/>
                    </span>
                          </OverlayTrigger>
                        </span>
                        <span className={"span-input"}>
                            <div className="inner-addon right-addon">

                            <Input  type="password"
                                    className="form-control"
                                    name="firstPassword"
                                    ref="password"
                                    defaultValue=""
                                    onChange={this.onChangePassword}
                                    validations={[required, invalidPassword]}
                                    required /></div>
                        </span>
                    </label>
                    <br/>
                    <span className={"password-strength"}>
                      <PasswordStrengthBar className={"password"}
                      minLength={6}
                      scoreWords={['', '', '', '']}
                      shortScoreWord={""}
                      password={this.state.password} />
                    </span>

                    <label className={"label-setting"}>
                        <span className={"span-input"}></span>
                        <span className={"span-input"}>
                            <Input  type="password"
                                    ref="password_again"
                                    name="secondPassword"
                                    className="form-control"
                                    defaultValue=""
                                    placeholder="Heslo znovu"
                                    validations={[required, this.checkSecondPassword]}
                                    required />
                        </span>
                    </label>
                    <br/>
                    {this.state.message && (
                        <div className="alert alert-danger my-alert1 text-bold" role="alert">
                            <BsExclamationTriangleFill className={"alert-icon"}/>{ this.state.message}
                        </div>
                    )}
  
  
                    <div className={"btn-align-center"}>
                        {getButton(this.state.isRegistered)}
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
}
export default RegistrationComponent