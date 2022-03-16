import ReactDOM from "react-dom";
import React from "react";
import Form from "react-validation/build/form";
import AuthService from "../../services/AuthService";
import CheckButton from "react-validation/build/button";
import "./RegistrationComponent.css";

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
            <section className={"d-flex justify-content-center mt-2"} >
                <Form onSubmit={this.handleRegister}
                ref={(c) => {
                    this.form = c;
                    }}
                >
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
                    <br/>
                    <label>
                        <div>E-mail</div>
                        <input  type="email"
                                ref="email"
                                defaultValue=""
                                required />
                    </label>
                    <br/>
                    <label>
                        <div>Jméno</div>
                        <input  type="text"
                                ref="name"
                                defaultValue=""
                                required />
                    </label>
                    <br/>
                    <label>
                        <div>Příjmení</div>
                        <input  type="text"
                                ref="name"
                                defaultValue=""
                                required />
                    </label>
                    <br/>
                    <label>
                        <div>Škola</div>
                        <select name="school" id="school">
                            <option value="volvo">Gymnázium Ostrava 1</option>
                            <option value="saab">Frýdek-Místek Cihelní</option>
                            <option value="mercedes">Čeladná ZŠ</option>
                            <option value="audi">Frýdek-Místek 6.</option>
                        </select>
                    </label>
                    <br/>
                    <label>
                        <div>Telefon</div>
                        <input  type="tel"
                                ref="phone"
                                defaultValue=""
                                required />
                    </label>
                    <br/>
                    <label>
                        <div>Heslo</div>
                        <input  type="password"
                                ref="password"
                                defaultValue=""
                                required />
                    </label>
                    <br/>
                    <label>
                        <input  type="password"
                                ref="password_again"
                                defaultValue=""
                                placeholder="Heslo znovu"
                                required />
                    </label>
                    <br/>
                    <button>Zaregistrovat se</button>
                    <CheckButton
                        style={{ display: "none" }}
                        ref={(c) => {
                            this.checkBtn = c;
                        }}
                    />
                </Form>
                <br/>
            </section>
        <a className={"d-flex justify-content-center mt-2"} href = "login">Přihlásit se</a>
            </div>
        );
    }
}
export default RegistrationComponent