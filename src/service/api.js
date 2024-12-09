import { axios } from "../../config/axiosConfig";

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
