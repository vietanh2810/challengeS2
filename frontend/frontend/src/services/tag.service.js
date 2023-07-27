import axios from 'axios';
import authHeader from './auth-header';

const API_URL = import.meta.env.VITE_API_ENDPOINT;

class TagService {
    getTags() {
        return axios.get(API_URL + '/tags/', { headers: authHeader() });
    }
}

export default new TagService();