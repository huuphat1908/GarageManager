import axios from 'axios';

const axiosClient = axios.create({
    baseURL: 'https://garage-manager-uit.herokuapp.com/',
    withCredentials: true
})

export default axiosClient;