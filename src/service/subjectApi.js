import { axiosInstance } from "../../config/axiosConfig";

export const getSubjects = async () => {
  const response = await axiosInstance.get(`/subject/`);
  return response;
};

export const addSubject = async (name) => {
  const response = await axiosInstance.post(`/subject/`, {
    name: name,
  });
  return response;
};