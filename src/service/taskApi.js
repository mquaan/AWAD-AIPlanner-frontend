import { axiosInstance } from "../../config/axiosConfig";
import { priorityToString } from "../utils/priority";
import { statusToString } from "../utils/status";

export const getTasks = async (query) => {
  const response = await axiosInstance.get(`/task/?${query}`);
  return response;
};

export const updateTask = async (task) => {
  const response = await axiosInstance.put(`/task/${task.id}`, {
    "name": task.name,
    "description": task.description,
    "subject_id": task.subject.id,
    "priority": priorityToString(task.priority),
    "status": statusToString(task.status),
    "estimated_start_time": task.estimated_start_time,
    "estimated_end_time": task.estimated_end_time
  });
  return response;
};

export const addTask = async () => {
  const response = await axiosInstance.post(`/task`, {
    "name": "123",
    "description": "123",
    "subject_id": "675b34719d16a02d3166c363",
    "priority": "Medium",
    "estimated_start_time": "2024-12-15T10:00:00Z",
    "estimated_end_time": "2024-12-20T08:00:00Z"
});
  return response;
};