import axios from "axios";
import Cookies from 'js-cookie';

const API_URL = "http://localhost:8080/login";

class AuthService {
    login(username, password) {
        return axios
            .post(API_URL,{
                username,
                password
            }, { withCredentials: true })
            .then(response => {
                if (!response.data.access_token) {
                    localStorage.setItem("user", JSON.stringify(response.data));
                    console.log(response)
                    console.log(response.headers)
                    console.log(response.data.role)
                    console.log(Cookies.get("access_token"))
                }

                return response.data;
            });
    }

    logout() {
        localStorage.removeItem("user");
    }

    getCurrentUser() {
        return JSON.parse(localStorage.getItem('user'));
    };
}

export default new AuthService();