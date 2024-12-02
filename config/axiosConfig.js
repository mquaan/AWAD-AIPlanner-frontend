import axios from 'axios';

const axiosInstance = axios.create({
//   baseURL: 'http://localhost:8080/api'
    baseURL: import.meta.env.VITE_BACKEND_URL + '/api'
})

export default axiosInstance;