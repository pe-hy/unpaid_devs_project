import React, { Component } from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import AuthService from "../../services/AuthService";
import { Navigate } from "react-router-dom";
import {
  BsEnvelopeFill,
  BsLockFill,
  BsExclamationTriangleFill,
} from "react-icons/bs";

import "./LoginFormStyles.css";

const required = (value) => {
  if (!value) {
    return (
      <div className="alert alert-danger my-alert" role="alert">
        <BsExclamationTriangleFill /> Toto pole je povinné!
      </div>
    );
  }
};
export default class Login extends Component {
  constructor(props) {
    super(props);
    this.handleLogin = this.handleLogin.bind(this);
    this.onChangeUsername = this.onChangeUsername.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.state = {
      username: "",
      password: "",
      loading: false,
      message: "",
      redirectToLogin: false,
      currentRole: null,
    };
  }
  onChangeUsername(e) {
    this.setState({
      username: e.target.value,
    });
  }
  onChangePassword(e) {
    this.setState({
      password: e.target.value,
    });
  }
  handleLogin(e) {
    console.log("handling login");
    e.preventDefault();
    //Use something like this to check renderering, but after everything is fetched from the server
    // Uncomment this below and add proper error handling for servercall
    this.form.validateAll();
    if (this.checkBtn.context._errors.length === 0) {
      AuthService.login(this.state.username, this.state.password).then(
        (res) => {
          this.setState({
            redirectToLogin: true,
            currentRole: localStorage.getItem("role"),
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
      return <Navigate to="/studentHome" />;
    if (this.state.redirectToLogin && this.state.currentRole === "ROLE_TEACHER")
      return <Navigate to="/teacherHome" />;
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
                  <BsEnvelopeFill />
                </i>
                <Input
                  type="text"
                  className="form-control"
                  name="username"
                  placeholder="example@osu.cz"
                  value={this.state.username}
                  onChange={this.onChangeUsername}
                  validations={[required]}
                />
              </div>
            </div>
            <div className="form-group form-cointainer">
              <label htmlFor="password" className="text-bold text-padding">
                Heslo
              </label>
              <div className="inner-addon left-addon">
                <i className="glyphicon glyphicon-user icon-form">
                  <BsLockFill />
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
            <a href = "localhost:8080/forgotpassword" className={"float-end mt-2"} style={{marginRight: "20px"}}>Zapomenuté heslo</a>
            <div className="form-group button-login pt-5">
              {this.state.message && (
                  <div className="alert alert-danger" role="alert">
                    {this.state.message}
                  </div>
              )}
              <button
                className="btn btn-primary btn-block button-lg"
                disabled={this.state.loading}
              >
                {this.state.loading && (
                  <span className="spinner-border spinner-border-sm"></span>
                )}
                <span className="text-bold">Přihlásit se</span>
              </button>
            </div>
            <a href = "localhost:8080/register" className={"d-flex justify-content-center mt-2"}>Zaregistrovat se</a>
            <CheckButton
              style={{ display: "none" }}
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
