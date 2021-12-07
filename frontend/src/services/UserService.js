import axios from 'axios';
import authHeader from './AuthHeader';

const API_URL = 'http://localhost:8080/login/';

class UserService {

    getPublicContent() {
        return axios.get(API_URL + 'all');
    }

    getUserBoard() {
        return axios.get(API_URL + 'student', { headers: auth_header() });
    }

    getTeacherBoard() {
        return axios.get(API_URL + 'ucitel', { headers: auth_header() });
    }

    getCoordinatorBoard() {
        return axios.get(API_URL + 'koordinator', { headers: auth_header() });
    }
    getAdminBoard() {
        return axios.get(API_URL + 'admin', { headers: auth_header() });
    }
}

export default new UserService();