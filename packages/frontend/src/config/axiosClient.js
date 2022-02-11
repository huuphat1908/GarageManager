import axios from 'axios';

const axiosClient = axios.create({
    baseURL: process.env.API_URL || "localhost:8080/"
})

export default axiosClient;