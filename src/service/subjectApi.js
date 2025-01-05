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

export const modifySubject = async (id, data) => {
  const response = await axiosInstance.put(`/subject/${id}`, {
    name: data,
  });
  return response;
};

export const deleteSubject = async (id) => {
  const response = await axiosInstance.delete(`/subject/${id}`);
  return response;
};

export const getAllNumTask = async () => {
  const response = await axiosInstance.get(`/subject/amount-task`);
  return response;
}