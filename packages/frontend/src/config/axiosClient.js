import axios from 'axios';

const axiosClient = axios.create({
    baseURL: 'https://garage-manager-uit.herokuapp.com',
    headers: {
        'content-type': 'application/json',
    },
    withCredentials: true
})

export default axiosClient;