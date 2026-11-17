import axios from "axios";
import { API_BASE_URL } from "./authApi";

// 1. ดึงข้อมูลความก้าวหน้าทั้งหมด (ตรงกับ GET /api/getProgress ใน Backend)
export async function getAllProgressApi() {
  const token = localStorage.getItem("token");
  const response = await axios.get(`${API_BASE_URL}/getAllProgress`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

// 2. บันทึกความก้าวหน้าเมื่อทำด่านสำเร็จ (ตรงกับ POST /api/setProgress ใน Backend)
export async function setProgressApi(level_id: number) {
  const token = localStorage.getItem("token");
  const response = await axios.post(
    `${API_BASE_URL}/setProgress`,
    { level_id }, // ส่งค่า level_id ไปใน Body
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
}

// 3. ตรวจสอบเงื่อนไขใบประกาศนียบัตร (ตรงกับ GET /api/certificate ใน Backend)
export async function checkCertificateApi() {
  const token = localStorage.getItem("token");
  const response = await axios.get(`${API_BASE_URL}/certificate`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}