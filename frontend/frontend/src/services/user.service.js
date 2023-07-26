import axios from 'axios';
import authHeader from './auth-header';

const API_URL = import.meta.env.VUE_APP_API_ENDPOINT;

class UserService {
    validateUser(userId) {
        return axios.put(API_URL + '/users/validate' + userId, { headers: authHeader() });
    }

    getAdminBoard() {
        return axios.get(API_URL + '/users/', { headers: authHeader() });
    }
}

export default new UserService();