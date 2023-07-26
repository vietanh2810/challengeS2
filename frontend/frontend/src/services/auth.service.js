import axios from 'axios';
//get the API_URL from the .env file
const API_URL = 'http://localhost:8080/api';

// const API_URL = import.meta.env.VUE_APP_API_ENDPOINT;

class AuthService {
    login(user) {
        return axios
            .post(API_URL + '/users/login', {
                email: user.email,
                password: user.password
            })
            .then(response => {
                if (response.data.token) {
                    localStorage.setItem('user', JSON.stringify(response.data));
                }

                return response.data;
            });
    }

    logout() {
        localStorage.removeItem('user');
    }
    register(user) {
        const formData = new FormData();
        formData.append('userName', user.userName);
        formData.append('email', user.email);
        formData.append('password', user.password);
        formData.append('contactInfo', user.contactInfo);
        formData.append('companyName', user.companyName);
        formData.append('websiteUrl', user.websiteUrl);
        formData.append('kbis', user.kbis);

        return axios.post(`${API_URL}/users/signup`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data', // Set the content type to multipart/form-data
            },
        })
            .then(response => {
                return response.data;
            });
    }
}

export default new AuthService();