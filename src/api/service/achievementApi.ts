import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

// 1. ต้องมี s ต่อท้ายเป็น /achievements ให้ตรงกับหลังบ้าน
export async function getAchievementsApi() {
  const token = localStorage.getItem("token");
  const response = await axios.get(`${API_BASE_URL}/achievements`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

// 2. ส่วนอันนี้ /achievement/unlock (ไม่มี s) ถูกต้องแล้วตามที่คุณตั้งค่าไว้
export async function unlockAchievementApi(achievementId: number) {
  const token = localStorage.getItem("token");
  const response = await axios.post(
    `${API_BASE_URL}/achievement/unlock`,
    { achievementId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
}