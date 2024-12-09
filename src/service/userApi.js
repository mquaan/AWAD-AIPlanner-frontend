import { axiosInstance } from "../../config/axiosConfig";

export const getUserProfile = async (id) => {
  const response = await axiosInstance.get(`/user/profile/${id}`);
  return response;
};

export const updateUserProfile = async (data) => {
  const response = await axiosInstance.put(`/user/profile`, data);
  return response;
};

export const changePassword = async () => {
  const response = await axiosInstance.put(`/user/profile/password`, data);
  return response;
};