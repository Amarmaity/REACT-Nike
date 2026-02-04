import axios from "axios";
import { config } from "../../config/config";
config

const api = axios.create({
  baseURL: config.BASE_URL, // http://127.0.0.1:8000
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export default api;
