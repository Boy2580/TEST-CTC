import { useState, useMemo, useEffect } from "react";
import CustomBtn from "../components/CustomBtn";
import { Medal } from "../components/Medal";
import { MedalModal } from "../components/MedalModal";
import { LogoutModal } from "../components/LogoutModal";
import { ChangeUsernameModal } from "../components/ChangeUsernameModal";
import { MEDALS_DATA } from "../data/medalsData";
import { getAchievementsApi, unlockAchievementApi } from "../api/services/achievement";

export interface HomeScreenProps {
  username?: string;
  onExplore?: () => void;
  onLogout?: () => void;
  onUpdateUsername?: (newUsername: string) => void;
  canClaimCertificate?: boolean;
  onClaimCertificate?: () => void;
}

const SparkleStar = ({
  className = "",
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={`pointer-events-none select-none ${className}`}
    style={style}
  >
    <path d="M12 0C12 7 17 12 24 12C17 12 12 17 12 24C12 17 7 12 0 12C7 12 12 7 12 0Z" />
  </svg>
);

export const HomeScreen = ({
  username = "",
  onExplore,
  onLogout,
  onUpdateUsername,
  canClaimCertificate,
  onClaimCertificate,
}: HomeScreenProps) => {
  const [unlockedMedals, setUnlockedMedals] = useState<Record<number, boolean>>({});
  const [selectedMedalId, setSelectedMedalId] = useState<number | null>(null);
  const [isLogoutPromptOpen, setIsLogoutPromptOpen] = useState(false);
  const [isChangeUsernameOpen, setIsChangeUsernameOpen] = useState(false);
  const [claimableOverride, setClaimableOverride] = useState<boolean | null>(null);

  const isCertificateClaimable = claimableOverride ?? canClaimCertificate ?? false;
  
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
  const isAnyModalOpen = isModalOpen || isLogoutPromptOpen || isChangeUsernameOpen;

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
              <div className="flex items-center gap-[8px] max-w-full">
                <h1 className="font-['Mitr'] font-medium text-[28px] leading-tight truncate">
                  <span className="text-white">สวัสดีจ้า </span>
                  <span className="text-[#94D2FF]">{username}</span>
                </h1>
                <button
                  type="button"
                  onClick={() => setIsChangeUsernameOpen(true)}
                  className="cursor-pointer btn-squish p-1 -m-1 focus:outline-none shrink-0 transition-transform hover:scale-110 active:scale-95"
                >
                  <img
                    src="/images/Pencil_Icon.svg"
                    alt=""
                    draggable={false}
                    className="w-[26px] h-[26px] object-contain pointer-events-none"
                  />
                </button>
              </div>
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
                variant="green"
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

            {/* Certificate button (2 states: Locked & Claimable Gold with Shiny Stars) */}
            {!isCertificateClaimable ? (
              /* Locked State */
              <div
                onClick={() => setClaimableOverride(true)}
                title="คลิกเพื่อทดสอบสถานะปลดล็อก (Prototype)"
                className="relative w-full h-[48px] select-none cursor-pointer group"
              >
                <div className="absolute -inset-x-[3.5px] -top-[3.5px] h-[55px] bg-[#325884] border-[3.5px] border-[#06132e] rounded-[10px]" />
                <div className="absolute top-0 left-0 w-full h-[44px] bg-[#838d94] border-[3.5px] border-[#a7a7a7] rounded-[8px]" />
                <div className="absolute -inset-x-[3.5px] -top-[3.5px] h-[55px] backdrop-blur-[1px] bg-black/75 border-[3.5px] border-black rounded-[10px] transition-colors group-hover:bg-black/65" />
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
            ) : (
              /* Claimable Gold State */
              <div className="relative w-full h-[48px] select-none">
                {/* Shiny Star Particles (rendered around and on the button) */}
                <div className="absolute -inset-[14px] pointer-events-none z-30 overflow-visible">
                  <SparkleStar
                    className="absolute top-[2px] left-[14px] size-[18px] text-[#fff8b3] animate-sparkle"
                    style={{ animationDelay: "0s" }}
                  />
                  <SparkleStar
                    className="absolute -top-[5px] right-[28px] size-[16px] text-white animate-sparkle"
                    style={{ animationDelay: "0.5s" }}
                  />
                  <SparkleStar
                    className="absolute bottom-[4px] left-[32px] size-[13px] text-[#ffe680] animate-sparkle"
                    style={{ animationDelay: "1.1s" }}
                  />
                  <SparkleStar
                    className="absolute -bottom-[4px] right-[16px] size-[17px] text-[#fff3b0] animate-sparkle"
                    style={{ animationDelay: "0.3s" }}
                  />
                  <SparkleStar
                    className="absolute top-[16px] -left-[6px] size-[15px] text-white animate-star-float"
                    style={{ animationDelay: "0.8s" }}
                  />
                  <SparkleStar
                    className="absolute top-[13px] -right-[5px] size-[15px] text-[#ffeaa8] animate-star-float"
                    style={{ animationDelay: "1.4s" }}
                  />
                  <SparkleStar
                    className="absolute top-[5px] left-[54%] size-[11px] text-white animate-sparkle"
                    style={{ animationDelay: "1.7s" }}
                  />
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (onClaimCertificate) {
                      onClaimCertificate();
                    } else {
                      // Toggle back to locked for prototype testing
                      setClaimableOverride(false);
                    }
                  }}
                  className="relative w-full h-[48px] cursor-pointer btn-squish group focus:outline-none"
                >
                  {/* Yellow Shadow base (same as standard yellow button) */}
                  <div className="absolute -inset-x-[3.5px] -top-[3.5px] h-[55px] bg-[#cd5541] border-[3.5px] border-[#2e1406] rounded-[10px]" />

                  {/* Yellow Face (same as Explore button) */}
                  <div className="absolute top-0 left-0 w-full h-[44px] bg-[#fec559] group-hover:bg-[#ffd074] border-[4px] border-[#f7daa4] rounded-[8px] transition-colors flex items-center justify-center overflow-hidden" />

                  {/* Content */}
                  <div className="absolute inset-x-0 top-0 h-[44px] flex items-center justify-center gap-[9px] px-4 -translate-y-[2px] z-10 pointer-events-none">
                    <div className="size-[22px] shrink-0 flex items-center justify-center mb-0.5">
                      <img
                        src="/images/Hand_Icon.svg"
                        alt=""
                        draggable={false}
                        className="w-full h-full object-contain pointer-events-none"
                      />
                    </div>
                    <span
                      className="font-['Mitr'] font-medium text-[19px] text-white whitespace-nowrap leading-none"
                      style={{
                        WebkitTextStroke: "4.5px #2e1406",
                        paintOrder: "stroke fill",
                      }}
                    >
                      รับเกียรติบัตร
                    </span>
                  </div>
                </button>
              </div>
            )}
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

      {/* Change Username Modal Overlay */}
      <ChangeUsernameModal
        key={isChangeUsernameOpen ? `open-${username}` : "closed"}
        isOpen={isChangeUsernameOpen}
        currentUsername={username}
        onClose={() => setIsChangeUsernameOpen(false)}
        onSuccess={(newName) => {
          onUpdateUsername?.(newName);
        }}
      />
    </div>
  );
};

export default HomeScreen;