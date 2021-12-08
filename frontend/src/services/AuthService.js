import axios from "axios";

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
          localStorage.setItem("role", "ROLE_STUDENT");
        } else if (response.data.role === "ROLE_TEACHER") {
          localStorage.setItem("role", "ROLE_TEACHER");
        }
      }
      return response.data;
    });
  }

  logout() {
    localStorage.removeItem("user");
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem("user"));
  }
}

export default new AuthService();
