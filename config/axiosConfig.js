import axios from 'axios';
// import { getTokens, handleLogout, setTokens } from './storage';
// import { CustomError } from '../types/type';
// import { handleRefreshToken } from './api';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${localStorage.getItem('authToken')}`
  }
})

// const decodeToken = (token) => {
//     return JSON.parse(atob(token.split('.')[1]));
// }

// const handleExpiredAccessToken = async (refreshToken) => {
//     try {
//         const response = await handleRefreshToken(refreshToken);
//         const newAT = response.access_token;
//         const newRT = response.refresh_token;
//         setTokens(newAT, newRT);
//         return newAT;
//     } catch(error) {
//         console.log(error);
//     }
// }


// axiosInstance.interceptors.request.use(
//     async function(request) {
//         const { accessToken, refreshToken } = getTokens();
//         let _accessToken = accessToken;
//         if(_accessToken) {
//             const parsedData = decodeToken(_accessToken);
//             const expiredTime = new Date(parsedData.exp * 1000);
//             const currentTime = new Date();
//             const adjust = new Date(currentTime.getTime() + 1000);
//             if(adjust > expiredTime) {
//                 _accessToken = await handleExpiredAccessToken(refreshToken);
//                 if(!_accessToken) {
//                     handleLogout();
//                     window.location.href = '/login';
//                 }
//             }
//         }
//         request.headers.Authorization = `Bearer ${_accessToken}`;
//         return request;
//     },
//     function(error) {
//         return Promise.reject(error);
//     }
// );

// axiosInstance.interceptors.response.use(
//     function(response) {
//         // Any status code that lie within the range of 2xx cause this function to trigger
//         return response;
//     }, 
//     function(error) {
//         // Any status codes that falls outside the range of 2xx cause this function to trigger
//         console.log(error.response);
//         if(error.response?.status === 401) {
//             handleLogout();
//             console.log('403 hoặc 401');
//             // window.location.href = '/login';
//         }
//         const customError = {
//             message: error.message,
//             status: error.response?.status,
//             data: error.response?.data
//         }
//         return Promise.reject(customError);
//     }
// )

export default axiosInstance;