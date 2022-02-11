import axios from 'axios'

const baseURL = 'https://garage-manager-uit.herokuapp.com/';

export default function apiCaller(method, url, data) {
    return axios({
        method,
        url: `${baseURL}${url}`,
        data
      })
}