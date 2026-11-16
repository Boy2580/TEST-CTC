import axios from "axios";

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});


api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});


export const registerApi = async (email: string, password: string) => {
  try {
    const response = await api.post("/auth/register", { email, password });
    return response.data;
  } catch (err: any) {
    throw err.response?.data?.message || "ไม่สามารถสมัครสมาชิกได้";
  }
};


export const verifyOtpApi = async (email: string, otp: string) => {
  try {
    const response = await api.post("/auth/verify-otp", { email, otp });
    return response.data;
  } catch (err: any) {
    throw err.response?.data?.message || "รหัส OTP ไม่ถูกต้องหรือหมดอายุ";
  }
};


export const resendOtpApi = async (email: string) => {
  try {
    const response = await api.post("/auth/resend-otp", { email });
    return response.data;
  } catch (err: any) {
    throw err.response?.data?.message || "ไม่สามารถส่งรหัส OTP ใหม่ได้";
  }
};

// 4. ฟังก์ชันเข้าสู่ระบบด้วย Email และ Password
export const loginApi = async (email: string, password: string) => {
  try {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
  } catch (err: any) {
    throw err.response?.data?.message || "อีเมลหรือรหัสผ่านไม่ถูกต้อง";
  }
};

// 5. ฟังก์ชันเข้าสู่ระบบด้วย Google OAuth
export const googleLoginApi = async (accessToken: string) => {
  try {
    const response = await api.post("/auth/google", { token: accessToken });
    return response.data;
  } catch (err: any) {
    throw err.response?.data?.message || "ไม่สามารถเข้าสู่ระบบด้วย Google ได้";
  }
};