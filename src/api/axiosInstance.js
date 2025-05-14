import axios from "axios";
import { store } from "../store";
import { setUser, clearUser } from '../slices/userSlice'
import { toast } from "sonner";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_API_URL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.user?.accessToken;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response && 
        error.response.status === 401 && 
        !originalRequest._retry &&
        originalRequest.url !== 'api/token/refresh/') {
      
      originalRequest._retry = true;

      try {
        console.log('🔁 Attempting to refresh access token...');

        const refreshResponse = await axios.post(
          `${process.env.REACT_APP_BASE_API_URL}/api/token/refresh/`, 
          {}, 
          { withCredentials: true }
        );
        
        const newAccessToken = refreshResponse.data.access;

        store.dispatch(setUser({ accessToken: newAccessToken, isAdmin:true}));

        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        toast.error('Session expired. Please log in again.');
        console.error('❌ Failed to refresh token', refreshError);
        store.dispatch(clearUser());
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;