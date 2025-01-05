import { axios, axiosInstance } from "../../config/axiosConfig";

export const loginUser = async (credentials) => {
  const response = await axios.post(`/auth/login`, credentials);
  return response;
};

export const registerUser = async (data) => {
  const response = await axios.post(`/auth/register`, data);
  return response;
};

export const googleLogin = async () => {
  const response = await axios.get(`/auth/google_login`);
  return response;
};

export const userLogout = async () => {
  const response = await axiosInstance.post(`/auth/logout`);
  return response;
}

export const forgotPassword = async (data) => {
  const response = await axios.post(`/auth/forgot_password`, data);
  return response;
}