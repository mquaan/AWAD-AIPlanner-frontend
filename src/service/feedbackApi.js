import { axiosInstance } from "../../config/axiosConfig";

export const getFeedback = async () => {
  const response = await axiosInstance.get(`/ai/feedback`);
  return response;
};