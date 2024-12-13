import { axiosInstance } from "../../config/axiosConfig";

export const getTasks = async () => {
  const response = await axiosInstance.get(`/task/?limit=1000&page=1`);
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