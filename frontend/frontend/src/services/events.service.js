import axios from 'axios';
import authHeader from './auth-header';

const API_URL = import.meta.env.VITE_API_ENDPOINT;

class EventsService {
    
    getEventTypes() {
        return axios.get(API_URL + '/api/event/types', { headers: authHeader() });
    }

    getUrls() {
        return axios.get(API_URL + '/api/event/urls', { headers: authHeader() });
    }
}

export default new EventsService();