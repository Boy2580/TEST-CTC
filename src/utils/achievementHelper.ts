import { unlockAchievementApi } from "../api/service/achievementApi";

/**
 * ฟังก์ชันสำหรับสั่งปลดล็อก Achievement ตามหมายเลข ID
 * @param medalId เลข ID ของเหรียญรางวัล (เช่น 5)
 * @param onSuccess (Optional) Callback ทำงานต่อเมื่อปลดล็อกสำเร็จครั้งแรก เช่น แสดง Popup แจ้งเตือน
 */
export async function unlockAchievement(
  medalId: number, 
  onSuccess?: () => void
): Promise<boolean> {
  try {
    const response = await unlockAchievementApi(medalId);
    
    if (response && response.success) {
      console.log(`ปลดล็อกเหรียญที่ ${medalId} สำเร็จ!`);
      // ถ้ามี Callback ส่งมาให้ทำต่อ (เช่น เด้งโมเดลยินดีรับรางวัล)
      if (onSuccess) {
        onSuccess();
      }
      return true;
    }
    return false;
  } catch (err: any) {
    // ถ้าหลังบ้านฟ้องว่าเคยได้รับเหรียญนี้ไปแล้ว (Status 400) ให้ถือว่าปกติ ไม่ต้องแสดง Error
    if (err.response && err.response.status === 400) {
      console.log(`เหรียญที่ ${medalId} เคยถูกปลดล็อกไปแล้ว`);
    } else {
      console.error(`เกิดข้อผิดพลาดในการปลดล็อกเหรียญที่ ${medalId}:`, err);
    }
    return false;
  }
}