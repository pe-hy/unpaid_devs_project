import ReactDOM from "react-dom";
import React from "react";
const { Component } = React;

export class RegistrationComponent extends Component {
    componentDidMount() {
        ReactDOM.findDOMNode(this.refs.name).focus();
    }

    handleSubmit(event) {
        const { name, email, password } = this.refs;

        const user = {
            name: ReactDOM.findDOMNode(name).value,
            email: ReactDOM.findDOMNode(email).value,
            password: ReactDOM.findDOMNode(password).value,
        }

        console.log(user);
        event.preventDefault();
    }

    render() {
        return (
            <div>
                <div className={"container-registration"}>
            <p className="thick ">REGISTRACE</p>
                </div>
            <section className={"d-flex justify-content-center mt-2"} >
                <form onSubmit={ () => this.handleSubmit() }>
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
                </form>
                <br/>
            </section>
        <a className={"d-flex justify-content-center mt-2"} href = "login">Přihlásit se</a>
            </div>
        );
    }
}
export default RegistrationComponent