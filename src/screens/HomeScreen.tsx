import { useState, useMemo, useEffect } from "react";
import CustomBtn from "../components/CustomBtn";
import { Medal } from "../components/Medal";
import { MedalModal } from "../components/MedalModal";
import { LogoutModal } from "../components/LogoutModal";
import { MEDALS_DATA } from "../data/medalsData";
import { getAchievementsApi, unlockAchievementApi } from "../api/service/achievementApi";

export interface HomeScreenProps {
  username?: string;
  onExplore?: () => void;
  onLogout?: () => void;
}

export const HomeScreen = ({
  username = "",
  onExplore,
  onLogout,
}: HomeScreenProps) => {
  const [unlockedMedals, setUnlockedMedals] = useState<Record<number, boolean>>({});
  const [selectedMedalId, setSelectedMedalId] = useState<number | null>(null);
  const [isLogoutPromptOpen, setIsLogoutPromptOpen] = useState(false);
  
  // โหลดข้อมูล Achievement ของผู้ใช้จริงเมื่อเข้ามาที่หน้า Home
  useEffect(() => {
    const fetchUserAchievements = async () => {
      try {
        const data = await getAchievementsApi();
        if (data && data.achievements) {
          const unlockedMap: Record<number, boolean> = {};
          data.achievements.forEach((ach: any) => {
            // ใช้ Achievement_id เป็น Key และ isUnlocked เป็นสถานะจริงจากฐานข้อมูล
            unlockedMap[ach.Achievement_id] = ach.isUnlocked;
          });
          setUnlockedMedals(unlockedMap);
        }
      } catch (err) {
        console.error("Failed to fetch achievements:", err);
      }
    };

    fetchUserAchievements();
  }, []);

  const isModalOpen = selectedMedalId !== null;
  const isAnyModalOpen = isModalOpen || isLogoutPromptOpen;

  // ฟังก์ชันกดเพื่อปลดล็อก Achievement ผ่าน API
  const toggleMedalUnlock = async (medalId: number) => {
    try {
      const isCurrentlyUnlocked = unlockedMedals[medalId];
      
      // ถ้ายังไม่ปลดล็อก ให้เรียก API ไปบันทึกปลดล็อก
      if (!isCurrentlyUnlocked) {
        await unlockAchievementApi(medalId);
      }

      // อัปเดตสเตตฝั่งหน้าจอทันที
      setUnlockedMedals((prev) => ({
        ...prev,
        [medalId]: !prev[medalId],
      }));
    } catch (err) {
      console.error("Failed to unlock achievement:", err);
    }
  };

  const sortedMedalIds = useMemo(() => {
    const allIds = Array.from({ length: 14 }, (_, i) => i + 1);
    const hasAnyUnlocked = allIds.some((id) => Boolean(unlockedMedals[id]));
    if (!hasAnyUnlocked) {
      return allIds;
    }

    const unlockedList = allIds.filter((id) => Boolean(unlockedMedals[id]));
    const lockedList = allIds.filter((id) => !unlockedMedals[id]);
    return [...unlockedList, ...lockedList];
  }, [unlockedMedals]);

  return (
    <div className="relative w-full h-full overflow-hidden select-none">
      {/* Main content wrapper */}
      <div
        className={`w-full h-full flex flex-col justify-between transition-[filter,transform,opacity,scale] duration-300 ease-out ${
          isAnyModalOpen
            ? "blur-[5px] scale-[1] brightness-75 pointer-events-none"
            : "blur-none scale-100 brightness-100"
        }`}
      >
        {/* Background image */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img
            src="/images/Sawthong.png"
            alt=""
            loading="eager"
            draggable={false}
            className="w-full h-[50%] my-[-5%] object-cover object-[40%_0%] scale-125 transition-transform duration-500 ease-out pointer-events-none"
          />
        </div>

        {/* Inner vignette */}
        <div className="absolute inset-0 shadow-[inset_0px_4px_150px_50px_rgba(0,0,0,0.25)] pointer-events-none" />

        {/* Top bar */}
        <div className="relative z-20 flex items-center justify-between px-[10px] pr-[20px] pt-[15px] shrink-0">
          <img
            src="/images/Logo.png"
            alt="Logo"
            draggable={false}
            className="w-[200px] h-auto object-contain drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)] pointer-events-none"
          />

          {/* Logout button */}
          <CustomBtn
            variant="red"
            iconSrc="/images/Logout_Icon.svg"
            iconSize={22}
            iconClassName="mb-1"
            onClick={() => setIsLogoutPromptOpen(true)}
            title="ออกจากระบบ"
            className="size-[40px]"
          />
        </div>

        {/* Character illustration */}
        <div className="relative z-10 flex-1 min-h-0 flex items-end justify-center pointer-events-none">
          <img
            src="/images/chars/Girl.png"
            alt="Girl Character"
            draggable={false}
            className="w-[345px] max-h-full h-auto object-contain animate-character-idle drop-shadow-[0_4px_20px_rgba(0,0,0,0.25)]"
          />
        </div>

        {/* Footer panel */}
        <div className="relative z-20 w-full bg-gradient-to-b from-[#1e0202] to-[#130202] drop-shadow-[0px_-4px_2px_rgba(0,0,0,0.25)] px-[28px] pt-[14px] pb-[24px] shrink-0">
          {/* Jagged border */}
          <div className="absolute -top-[16px] inset-x-0 h-[23px] w-full pointer-events-none rotate-180">
            <img
              src="/images/Jagged.svg"
              alt=""
              draggable={false}
              className="w-full h-full object-fill block"
            />
          </div>

          <div className="flex flex-col gap-[15px] w-full">
            {/* Header greeting */}
            <div className="flex flex-col gap-[2px] w-full">
              <h1 className="font-['Mitr'] font-medium text-[28px] text-white leading-tight truncate">
                สวัสดีจ้า {username}
              </h1>
              <p className="font-['Mitr'] font-normal text-[18px] text-white/65 leading-snug">
                ออกสำรวจและเคลียร์ภารกิจเพื่อรับเกียรติบัตรกัน!
              </p>
            </div>

            {/* Medals grid */}
            <div className="flex flex-col gap-[12px] w-full">
              <h2 className="font-['Mitr'] font-medium text-[26px] text-white leading-tight">
                เหรียญรางวัลที่ได้รับ
              </h2>

              <div className="grid grid-cols-7 gap-[10px] w-full justify-items-center">
                {sortedMedalIds.map((id) => {
                  const medalData = MEDALS_DATA[id];
                  return (
                    <Medal
                      key={id}
                      id={id}
                      unlocked={Boolean(unlockedMedals[id])}
                      iconSrc={medalData?.iconSrc}
                      bgColor={medalData?.bgColor}
                      strokeColor={medalData?.strokeColor ?? medalData?.borderColor}
                      onClick={() => setSelectedMedalId(id)}
                    />
                  );
                })}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-[12px] w-full mt-[2px]">
              <CustomBtn
                label="ออกสำรวจ"
                iconSrc="/images/Search_Icon.svg"
                iconSize={30}
                onClick={onExplore}
                className="flex-1 !w-auto"
              />

              {/* Info button */}
              <CustomBtn
                variant="gray"
                iconSrc="/images/Question_Icon.svg"
                iconSize={{ width: 17, height: 23 }}
                iconClassName="mb-0.5"
                onClick={() => setSelectedMedalId(1)}
                title="ข้อมูลเหรียญรางวัล"
                className="size-[48px] shrink-0"
              />
            </div>

            {/* Certificate button */}
            <div className="relative w-full h-[48px] select-none">
              <div className="absolute -inset-x-[3.5px] -top-[3.5px] h-[55px] bg-[#325884] border-[3.5px] border-[#06132e] rounded-[10px]" />
              <div className="absolute top-0 left-0 w-full h-[44px] bg-[#838d94] border-[3.5px] border-[#a7a7a7] rounded-[8px]" />
              <div className="absolute -inset-x-[3.5px] -top-[3.5px] h-[55px] backdrop-blur-[1px] bg-black/75 border-[3.5px] border-black rounded-[10px]" />
              <div className="absolute inset-x-0 top-0 h-[44px] flex items-center justify-center gap-[8px] px-4 -translate-y-[2px] z-10 pointer-events-none">
                <div className="size-[22px] shrink-0 flex items-center justify-center">
                  <img
                    src="/images/Lock_Icon.svg"
                    alt="Locked"
                    draggable={false}
                    className="w-full h-full object-contain pointer-events-none"
                  />
                </div>
                <span className="font-['Mitr'] font-medium text-[17px] text-white whitespace-nowrap leading-none">
                  ผ่านทุกภารกิจเพื่อรับเกียรติบัตร
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Medal Details Modal Overlay */}
      <MedalModal
        isOpen={isModalOpen}
        medalId={selectedMedalId}
        unlocked={selectedMedalId !== null && Boolean(unlockedMedals[selectedMedalId])}
        onClose={() => setSelectedMedalId(null)}
        onToggleUnlock={toggleMedalUnlock}
      />

      {/* Logout Confirmation Modal Overlay */}
      <LogoutModal
        isOpen={isLogoutPromptOpen}
        onClose={() => setIsLogoutPromptOpen(false)}
        onConfirm={() => {
          setIsLogoutPromptOpen(false);
          onLogout?.();
        }}
      />
    </div>
  );
};

export default HomeScreen;