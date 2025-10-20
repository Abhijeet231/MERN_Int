//central  axios setup
import axios from "axios";

// Creating an axios instance with base URL and credentials
export const api = axios.create({
    baseURL: import.meta.env.VITE_APP_BASE_URL,
    withCredentials: true
});