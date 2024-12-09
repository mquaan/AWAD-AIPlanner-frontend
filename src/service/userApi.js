import { axiosInstance } from "../../config/axiosConfig";

export const getUserProfile = async () => {
  const response = await axiosInstance.get(`/user/profile`);
  return response;
};

export const updateUserProfile = async (data) => {
  const response = await axiosInstance.put(`/user/profile`, data);
  return response;
};

export const changePassword = async (data) => {
  const response = await axiosInstance.put(`/user/profile/password`, data);
  return response;
};