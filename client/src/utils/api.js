


import axios from "axios";
import {jwtDecode} from "jwt-decode";

const API = axios.create({
  baseURL: "https://pglink.onrender.com/api",
});


const isTokenExpired = (token) => {
  try {
    const decoded = jwtDecode(token);
    return decoded.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};


API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    if (isTokenExpired(token)) {

      localStorage.removeItem("token");
      window.location.href = "/login"; 
      return Promise.reject(new Error("Token expired"));
    }
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default API;
