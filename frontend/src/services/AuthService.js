import axios from "axios";

const API_URL = "http://localhost:8000";

export const authService = {
  post: async (endpoint, data) => {
    return axios.post(`${API_URL}/${endpoint}`, data);
  },
  get: async (endpoint) => {
    return axios.get(`${API_URL}/${endpoint}`);
  },
};
