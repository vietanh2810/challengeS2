import axios from 'axios';
import authHeader from './auth-header';

const API_URL = import.meta.env.VITE_API_ENDPOINT;

class DashboardService {
    getDashBoard(req) {
        return axios.post(API_URL + '/dashboard/',req, { headers: authHeader() });
    }
}

export default new DashboardService();