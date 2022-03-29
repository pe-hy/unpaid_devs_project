import axios from "axios";

function Logout() {
    document.cookie = "access_token" + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    return axios.get("localhost:3000/user/logout")
}
export default Logout;