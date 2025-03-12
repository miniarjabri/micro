import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

export const loginWithGithub = async () => {
  window.location.href = `${API_URL}/auth/github`;
};

export const fetchTasks = async (token) => {
  return axios.get(`${API_URL}/tasks`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const addTask = async (task, token) => {
  return axios.post(`${API_URL}/tasks`, { text: task }, {
    headers: { Authorization: `Bearer ${token}` }
  });
};
