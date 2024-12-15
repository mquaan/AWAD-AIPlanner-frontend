import { axiosInstance } from "../../config/axiosConfig";

export const getSubjects = async () => {
  const response = await axiosInstance.get(`/subject/`);
  return response;
};