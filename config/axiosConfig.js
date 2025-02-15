import axios from 'axios';

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL + '/api';

const axiosInstance = axios.create()

const axiosFileInstance = axios.create()

axiosInstance.interceptors.request.use(
  function (config) {
    config.headers["Authorization"] = `Bearer ${localStorage.getItem("authToken")}`;
    config.headers["Content-Type"] = "application/json";
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(function (response) {
  return response;
}, function (error) {
  if (error.status === 401) { // Unauthorized
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    alert('Session expired, please login again');
    window.location.href = '/login';
  }
  return Promise.reject(error);
});

axiosFileInstance.interceptors.request.use(
  function (config) {
    config.headers["Authorization"] = `Bearer ${localStorage.getItem("authToken")}`;
    config.headers["Content-Type"] = "multipart/form-data";
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

axiosFileInstance.interceptors.response.use(function (response) {
  return response;
}, function (error) {
  if (error.status === 401) { // Unauthorized
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    alert('Session expired, please login again');
    window.location.href = '/login';
  }
  return Promise.reject(error);
});

export { axios, axiosInstance, axiosFileInstance };