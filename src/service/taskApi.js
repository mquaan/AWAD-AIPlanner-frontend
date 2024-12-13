import { axiosInstance } from "../../config/axiosConfig";

export const getTasks = async () => {
  const response = await axiosInstance.get(`/task/?limit=1000&page=1`);
  return response;
};

export const updateTask = async (task) => {
  const response = await axiosInstance.put(`/task/${task.id}`, {
    "name": task.name,
    "description": task.description,
    "subject_id": task.subject.id,
    "priority": task.priority === 0 ? "High" : task.priority === 1 ? "Medium" : "Low",
    "status": task.status === 0 ? "ToDo" : task.status === 1 ? "InProgress" : task.status === 2 ? "Completed" : 'Expired',
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