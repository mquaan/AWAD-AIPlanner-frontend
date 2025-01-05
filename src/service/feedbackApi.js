import { axiosInstance } from "../../config/axiosConfig";

export const getFeedback = async (type) => {
  const response = await axiosInstance.get(`/ai/feedback?type=${type}`);
  return response;
};