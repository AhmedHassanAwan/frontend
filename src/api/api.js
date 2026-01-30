import axios from "axios";

const API = axios.create({
  baseURL: "http://15.206.198.248:3000",
});

// token interceptor (auto header)
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;
