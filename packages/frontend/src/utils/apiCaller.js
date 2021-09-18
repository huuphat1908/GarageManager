import axios from 'axios'

export default function apiCaller(method, url, data) {
    return axios({
        method,
        url,
        data
      })
}