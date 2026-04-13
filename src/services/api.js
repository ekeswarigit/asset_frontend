// import axios from "axios";

// //  Create Axios instance
// const api = axios.create({
//   baseURL: "http://localhost:8081/api",
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// //  Request Interceptor (attach token)
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token");

//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );
// // Response Interceptor (handle errors globally)
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     console.error("API Error:", error);
//     //  If unauthorized → logout
//     if (error.response && error.response.status === 401) {
//       alert("Session expired. Please login again.");
//       localStorage.removeItem("token");
//       window.location.href = "/";
//     }

//     return Promise.reject(error);
//   }
// );

// export default api;
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8081/api",
});

// ✅ Attach token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;