import axios from 'axios';
import authHeader from './auth-header';

const API_URL = import.meta.env.VITE_API_ENDPOINT;

class UserService {
    validateUser(userId) {
        return axios.put(API_URL + '/api/users/validate/' + userId,null, { headers: authHeader() });
    }

    getAdminBoard() {
        return axios.get(API_URL + '/api/users/', { headers: authHeader() });
    }
}

export default new UserService();