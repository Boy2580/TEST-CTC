import { setProgressApi } from "../api/services/pregress.ts";

/**
 * ฟังก์ชันสำหรับเรียกใช้เมื่อผู้เล่นทำภารกิจหรือเล่นเกมในด่านนั้นๆ จบตามเงื่อนไข
 * 
 * @example
 * // ตัวอย่างการใช้งานในหน้ามินิเกมหรือหน้าสรุปผลภารกิจ:
 * handleWinGame = async () => {
 *   await completeMission(currentLevelId, () => {
 *     console.log("บันทึกข้อมูลเรียบร้อยแล้ว เตรียมเด้งกลับหน้าแมพ");
 *     navigate("/map"); // เปลี่ยนหน้าหรือปิด Modal
 *   });
 * };
 * 
 * @param levelId ID ของด่าน (รองรับทั้ง number และ string เช่น 1 หรือ "1")
 * @param onSuccess (Optional) Callback ฟังก์ชันที่จะทำงานต่อเมื่อบันทึกสำเร็จ
 * @returns Promise<boolean> คืนค่า true ถือว่าสำเร็จ, false ถ้าเกิดข้อผิดพลาด
 */
export async function completeMission(levelId: number | string, onSuccess?: () => void): Promise<boolean> {
  try {
    // แปลง ID ด่านให้ตรงกับ Backend (ถ้าด่านแรกเป็น 0 ให้แปลงเป็น 6 ตาม Database)
    const targetLevelId = Number(levelId) === 0 ? 6 : Number(levelId);

    console.log(`กำลังบันทึกความก้าวหน้าสำหรับด่าน ${targetLevelId}...`);
    const res = await setProgressApi(targetLevelId);

    if (res.success) {
      console.log(`🎉 ผ่านภารกิจด่าน ${targetLevelId} สำเร็จ!`);
      if (onSuccess) onSuccess();
      return true;
    } else {
      console.error("บันทึกไม่สำเร็จ:", res.message);
      return false;
    }
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการเชื่อมต่อเพื่อบันทึกภารกิจ:", error);
    return false;
  }
}