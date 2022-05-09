import axios from "axios";

const LOGIN_URL = `${process.env.REACT_APP_AXIOS_URL}/login`;
const REGISTER_URL = `${process.env.REACT_APP_AXIOS_URL}/register`;
const CONFIRMATION_URL = `${process.env.REACT_APP_AXIOS_URL}/register/confirm?`;
const CHANGE_PASSWORD_URL = `${process.env.REACT_APP_AXIOS_URL}/user/changePassword`;
const EMAIL_FOR_RESET_URL = `${process.env.REACT_APP_AXIOS_URL}/user/emailForReset`;
const FORGOT_PASSWORD_URL = `${process.env.REACT_APP_AXIOS_URL}/user/forgotPassword`;

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

    changePassword(oldPassword, newPassword) {
        var formData = JSON.stringify({oldPassword, newPassword});
        console.log(formData);

        return axios({
            url: CHANGE_PASSWORD_URL,
            headers: {'content-type': 'application/json'},
            withCredentials: true,
            method: "POST",
            data: formData,
        }).then((response) => {
            if (response) {
            }
            return response.data;
        });
    }

    forgotPasswordEmail(email) {
        var formData = JSON.stringify({email});
        console.log(formData);

        return axios({
            url: EMAIL_FOR_RESET_URL,
            headers: {'content-type': 'application/json'},
            withCredentials: true,
            method: "POST",
            data: formData,
        }).then((response) => {
            if (response) {
                return response.data
            }
            return response.data;
        });
    }

    forgotPasswordAfterAuthorization(password, token) {
        var formData = JSON.stringify({newPassword: password, token: token});
        console.log(formData);

        return axios({
            url: FORGOT_PASSWORD_URL,
            headers: {'content-type': 'application/json'},
            withCredentials: true,
            method: "POST",
            data: formData,
        }).then((response) => {
            if (response) {
            }
            return response.data;
        });
    }
}

export default new AuthService();
