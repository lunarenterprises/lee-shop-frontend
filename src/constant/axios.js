import axios from "axios";

const baseUrl = import.meta.env.VITE_BASE_URL
console.log("baseUrl : ", baseUrl)
const axiosInstance = axios.create({
    baseURL: baseUrl,
    timeout: 30000,
    headers: {
        "Content-Type": "application/json",
    },
});

// Request Interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token"); // or sessionStorage
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Handle unauthorized globally
            console.warn("Unauthorized, logging out...");
            localStorage.removeItem("token");
            window.location.href = "/login"; // optional redirect
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;