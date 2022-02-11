import axios from 'axios'

const baseURL = process.env.API_URL || 'localhost:8080/';

export default function apiCaller(method, url, data) {
    return axios({
        method,
        url: `${baseURL}${url}`,
        data
      })
}