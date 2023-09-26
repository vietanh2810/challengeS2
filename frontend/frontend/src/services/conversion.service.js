import axios from 'axios';
import authHeader from './auth-header';

const API_URL = import.meta.env.VITE_API_ENDPOINT;

class ConversionService {
    getConversions() {
        return axios.get(API_URL + '/api/conversions', { headers: authHeader() });
    }
}

export default new ConversionService();