import axios from "axios";

const LOGIN_URL = "http://localhost:8080/login";
const REGISTER_URL = "http://localhost:8080/register";

class AuthService {
  login(username, password) {
    const formData = JSON.stringify({ username, password });
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
        }
        if (response.data.role === "ROLE_STUDENT") {
          localStorage.setItem("role", "ROLE_STUDENT");
        } else if (response.data.role === "ROLE_TEACHER") {
          localStorage.setItem("role", "ROLE_TEACHER");
        }
      }
      return response.data;
    });
  }

  register(email, firstName, lastName, school, phoneNumber, password, role) {
    var formData = JSON.stringify({ email, firstName, lastName, school, phoneNumber, password, role });
    console.log(formData);
    
    return axios({
      url: REGISTER_URL,
      headers: { 'content-type': 'application/json' },
      withCredentials: false,
      method: "POST",
      data: formData,
    }).then((response) => {
      if(response){
      }
      return response.data;
    });
  }
}

export default new AuthService();
