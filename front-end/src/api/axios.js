import axios from "axios";
import { config } from "../../config/config";

const api = axios.create({
  baseURL: config.BASE_URL,
  withCredentials: true, 
});

export default api;
