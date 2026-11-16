import { useState } from "react";
import { Medal } from "./Medal";
import { MEDALS_DATA, type MedalData } from "../data/medalsData";

export interface MedalModalProps {
  isOpen: boolean;
  medalId: number | null;
  unlocked: boolean;
  medalData?: MedalData;
  onClose: () => void;
  onToggleUnlock?: (medalId: number) => void;
}

export const MedalModal = ({
  isOpen,
  medalId,
  unlocked,
  medalData: customMedalData,
  onClose,
  onToggleUnlock,
}: MedalModalProps) => {
  const [closing, setClosing] = useState(false);

  if (!isOpen || medalId === null) return null;

  const data = customMedalData ?? MEDALS_DATA[medalId] ?? {
    id: medalId,
    title: `เหรียญที่ ${medalId}`,
    unlockedDesc: `${medalId}`,
    lockedDesc: `${medalId}`,
    iconSrc: "/images/medals/Healthy.png",
    bgColor: "#a9a9a9",
    strokeColor: "rgba(0, 0, 0, 0.5)",
  };

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      setClosing(false);
      onClose();
    }, 200);
  };

  const title = data.title;
  const desc = data.desc;

  return (
    <div className="absolute inset-0 z-40 w-full h-full overflow-hidden select-none flex items-center justify-center">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-[rgba(0,0,0,0.35)] transition-opacity duration-250 ${
          closing ? "opacity-0" : "animate-backdrop-in"
        }`}
      />

      {/* Card */}
      <div
        className={`relative z-10 w-[341px] pointer-events-auto ${
          closing ? "animate-popup-out" : "animate-popup-in"
        }`}
      >
        <div className="absolute -inset-x-[3.5px] -top-[3.5px] -bottom-[7.5px] bg-[#cd5541] border-[3.5px] border-[#2e1406] rounded-[24px] shadow-[0_16px_40px_rgba(0,0,0,0.65)] pointer-events-none" />

        {/* Top badge */}
        <div className="absolute -top-[45px] left-1/2 -translate-x-1/2 z-20">
          <Medal
            id={medalId}
            unlocked={unlocked}
            iconSrc={data.iconSrc}
            bgColor={data.bgColor}
            strokeColor={data.strokeColor ?? data.borderColor}
            size="lg"
            onClick={() => onToggleUnlock?.(medalId)}
          />
        </div>

        <div className="relative bg-gradient-to-b from-[#1e0202] to-[#202020] border-[4px] border-[#f7daa4] rounded-[22px] opacity-95 pt-[56px] pb-[24px] px-[24px] flex flex-col items-center">
          <h2 className="font-['Mitr'] font-medium text-[30px] text-white text-center leading-none">
            {title}
          </h2>

          <p className="font-['Mitr'] font-normal text-[16px] text-white/75 text-center leading-[1.35] mt-[12px] max-w-[260px]">
            {desc}
          </p>

          {/* Confirm button */}
          <button
            type="button"
            onClick={handleClose}
            className="group relative mt-[22px] w-[146px] h-[38px] cursor-pointer btn-squish focus:outline-none select-none"
          >
            <div className="absolute -inset-x-[3.5px] -top-[3.5px] h-[46px] bg-[#cd5541] border-[3.5px] border-[#2e1406] rounded-[10px]" />
            <div className="absolute top-0 left-0 w-full h-[36px] bg-[#fec559] group-hover:bg-[#ffd074] border-[4px] border-[#f7daa4] rounded-[8px] transition-colors flex items-center justify-center">
              <span className="font-['Mitr'] font-medium text-[16px] text-white [-webkit-text-stroke:5px_#2e1406] [paint-order:stroke_fill] leading-none mb-0.5">
                ตกลง
              </span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MedalModal;
