import axios from "axios";

const BASE_URL = "https://web-production-5dcd.up.railway.app";

export const loginUser = async (credentials) => {
  const response = await axios.post(`${BASE_URL}/login`, credentials);
  return response;
};

export const registerUser = async (data) => {
  const response = await axios.post(`${BASE_URL}/register`, data);
  return response;
};

export const getUserProfile = async () => {
  const response = await axios.get(`${BASE_URL}/profile`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    },
  });
  return response;
};