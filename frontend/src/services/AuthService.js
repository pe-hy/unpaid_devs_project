import axios from "axios";
import Cookies from "js-cookie";

const API_URL = "http://localhost:8080/login";

class AuthService {
  login(username, password) {
    const formData = JSON.stringify({ username, password });
    return axios({
      url: API_URL,
      withCredentials: true,
      method: "POST",
      data: formData,
    }).then((response) => {
      if (response) {
        localStorage.setItem("user", JSON.stringify(response.data));
        if (response.data.role === "ROLE_STUDENT") {
          console.log("I am student");
        }
      }
      return response.data;
    });

    // return axios
    //   .post(
    //     API_URL,
    //     {
    //       username,
    //       password,
    //     },
    //     { withCredentials: true }
    //   )
    //   .then((response) => {
    //     console.log(response);
    //     if (response.access_token) {
    //       localStorage.setItem("user", JSON.stringify(response.data));
    //       localStorage.setItem("token", response.data.access_token);
    //       console.log(response);
    //       console.log(response.headers);
    //       console.log(response.data.role);
    //     }
    //     return response.data;
    //   });
  }

  logout() {
    localStorage.removeItem("user");
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem("user"));
  }
}

export default new AuthService();
