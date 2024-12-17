import { axiosInstance } from "../../config/axiosConfig";

export const getTasks = async (query) => {
  const response = await axiosInstance.get(`/task/?${query}`);
  return response;
};

export const updateTask = async (task) => {
  const response = await axiosInstance.put(`/task/${task.id}`, {
    "name": task.name,
    "description": task.description,
    "subject_id": task.subject_id,
    "priority": task.priority,
    "status": task.status,
    "estimated_start_time": task.estimated_start_time,
    "estimated_end_time": task.estimated_end_time
  });
  return response;
};

export const updateTaskStatus = async (task) => {
  const response = await axiosInstance.put(`/task/status/${task.id}`, {
    "status": task.status,
  });
  return response;
};

export const addTask = async (task) => {
  const response = await axiosInstance.post(`/task/`, task);
  return response;
};