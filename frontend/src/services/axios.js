import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

const addAuth = (token) => {
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

const removeAuth = () => {
  delete api.defaults.headers.common["Authorization"];
};

export { addAuth, removeAuth };
export default api;
