import axios from 'axios';
import authHeader from './AuthHeader';

const API_URL = 'http://localhost:8080/login/';

class UserService {

    getPublicContent() {
        return axios.get(API_URL + 'all');
    }

    getUserBoard() {
        return axios.get(API_URL + 'student', { headers: authHeader() });
    }

    getTeacherBoard() {
        return axios.get(API_URL + 'ucitel', { headers: authHeader() });
    }

    getCoordinatorBoard() {
        return axios.get(API_URL + 'koordinator', { headers: authHeader() });
    }
    getAdminBoard() {
        return axios.get(API_URL + 'admin', { headers: authHeader() });
    }
}

export default new UserService();