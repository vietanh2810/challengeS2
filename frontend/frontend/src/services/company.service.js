import axios from 'axios';
import authHeader from './auth-header';

const API_URL = import.meta.env.VITE_API_ENDPOINT;

class CompanyService {
    getCompany() {
        return axios.get(API_URL + '/api/company', { headers: authHeader() });
    }
}

export default new CompanyService();