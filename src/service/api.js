import axiosInstance from "../../config/axiosConfig";

// const BASE_URL = "https://web-production-5dcd.up.railway.app";

export const loginUser = async (credentials) => {
  const response = await axiosInstance.post(`/auth/login`, credentials);
  return response;
};

export const registerUser = async (data) => {
  const response = await axiosInstance.post(`/auth/register`, data);
  return response;
};

export const getUserProfile = async (id) => {
  const response = await axiosInstance.get(`/user/profile/${id}`);
  return response;
};

export const googleLogin = async () => {
  const response = await axiosInstance.get(`/auth/google_login`);
  return response;
}

export const googleCallback = async (code) => {
  const response = await axiosInstance.get(`/auth/google_callback`, {
      params: { code }
    }
  );
  return response;
}