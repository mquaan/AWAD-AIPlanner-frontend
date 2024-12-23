import { axiosInstance } from "../../config/axiosConfig";

export const getTimerSettings = async () => {
  const response = await axiosInstance.get(`/time-setting/`);
  return response;
};

export const updateTimerSettings = async (data) => {
  const response = await axiosInstance.put(`/time-setting/`, data);
  return response;
}