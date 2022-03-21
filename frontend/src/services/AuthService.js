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
        if (response.data.role === "ROLE_STUDENT") {
          localStorage.setItem("role", "ROLE_STUDENT");
        } else if (response.data.role === "ROLE_TEACHER") {
          localStorage.setItem("role", "ROLE_TEACHER");
        }
      }
      return response.data;
    });
  }

  register(email, name, surname, school, telephone, password, occupation) {
    var formData = null;
    if(occupation == "student"){
      formData = JSON.stringify({ email, name, surname, password, occupation });
    }
    else{
      formData = JSON.stringify({ email, name, surname, school, telephone, password, occupation });
    }
    
    return axios({
      url: REGISTER_URL,
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
