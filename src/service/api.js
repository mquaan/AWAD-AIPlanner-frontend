import axiosInstance from "../../config/axiosConfig";

// const BASE_URL = "https://web-production-5dcd.up.railway.app";

export const loginUser = async (credentials) => {
  const response = await axiosInstance.post(`/auth/login`, credentials);
  return response;
};

export const registerUser = async (data) => {
  const response = await axios.post(`/auth/register`, data);
  return response;
};

export const getUserProfile = async (id) => {
  const response = await axios.get(`/user/profile/${id}`, {
    // headers: {
    //   Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    // },
  });
  return response;
};