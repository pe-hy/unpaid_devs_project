import axios from "axios";

const LOGIN_URL = `${process.env.REACT_APP_AXIOS_URL}/login`;
const REGISTER_URL = `${process.env.REACT_APP_AXIOS_URL}/register`;
const CONFIRMATION_URL = `${process.env.REACT_APP_AXIOS_URL}/register/confirm?`;

class AuthService {
    login(username, password) {
        const formData = JSON.stringify({username, password});
        return axios({
            url: LOGIN_URL,
            withCredentials: true,
            method: "POST",
            data: formData,
        }).then((response) => {
            if (response) {
                localStorage.setItem("user", JSON.stringify(response.data));
                if (response.data.role === "ROLE_COORDINATOR") {
                    localStorage.setItem("role", "ROLE_COORDINATOR");
                } else if (response.data.role === "ROLE_STUDENT") {
                    localStorage.setItem("role", "ROLE_STUDENT");
                } else if (response.data.role === "ROLE_TEACHER") {
                    localStorage.setItem("role", "ROLE_TEACHER");
                } else if (response.data.role === "ROLE_ADMIN"){
                    localStorage.setItem("role", "ROLE_ADMIN");
                }
            }
            return response.data;
        });
    }

    register(email, firstName, lastName, school, phoneNumber, password, role) {
        var formData = JSON.stringify({email, firstName, lastName, school, phoneNumber, password, role});
        console.log(formData);

        return axios({
            url: REGISTER_URL,
            headers: {'content-type': 'application/json'},
            withCredentials: false,
            method: "POST",
            data: formData,
        }).then((response) => {
            if (response) {
            }
            return response.data;
        });
    }

    sendConfirmationToken(token) {
        return axios({
            url: CONFIRMATION_URL + token,
            withCredentials: false,
            method: "GET",
        }).then((response) => {
            if (response) {
                return response.data
            }
            return response.data;
        });
    }

}

export default new AuthService();
