import CustomBtn from "./CustomBtn";
import type { MissionLevelData } from "../data/missionsData";

export interface MissionLevelBoxProps {
  level: MissionLevelData;
  topPx: number;
  isCompleted?: boolean;
  onStartMission?: (level: MissionLevelData) => void;
  onInfoClick?: (level: MissionLevelData) => void;
}

export const MissionLevelBox = ({
  level,
  topPx,
  isCompleted = false,
  onStartMission,
  onInfoClick,
}: MissionLevelBoxProps) => {
  const buttonLabel = isCompleted
    ? level.completedButtonLabel || "เล่นซ้ำอีกรอบ"
    : level.buttonLabel || "เริ่มภารกิจ";

  const buttonIcon = isCompleted
    ? level.completedButtonIcon || level.buttonIcon || "/images/Hand_Icon.svg"
    : level.buttonIcon || "/images/Hand_Icon.svg";

  const buttonVariant = isCompleted
    ? level.completedButtonVariant || "blue"
    : level.buttonVariant || "yellow";

  return (
    <div
      className="absolute left-0 w-[420px] h-[406px] select-none"
      style={{ top: `${topPx}px` }}
    >
      {/* Card Frame (kept original 286:344 aspect ratio scaled to 338:406) */}
      <div className="absolute left-[70px] top-0 w-[338px] h-[406px]">
        <div className="w-[338px] h-[406px] bg-[#6f695e] border-[3.5px] border-[#2e1406] rounded-[12px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]" />
        <div className="absolute inset-x-0 top-0 w-[338px] h-[399px] bg-[#f2f2d8] border-[3.5px] border-[#a6a198] rounded-[12px]" />
      </div>

      {/* Preview Image (kept original 255:132 ratio scaled to 301:156) */}
      <div className="absolute left-[88px] top-[79px] w-[301px] h-[156px] border-[3.5px] border-[#2e1406] rounded-[6px] overflow-hidden bg-[#2e1406]">
        <img
          src={level.image}
          alt={level.header}
          draggable={false}
          className={`w-full h-full pointer-events-none ${
            level.imageClassName || "object-cover object-center"
          }`}
        />
      </div>

      {/* Description */}
      <div className="absolute left-[88px] top-[247px] w-[301px] font-['Mitr'] font-normal text-[17px] text-[#2e1406] leading-[1.4] tracking-[0.2px]">
        <span>{level.desc} </span>
        {level.highlightText && (
          <span className="font-medium text-[#e4262a]">
            {level.highlightText}
          </span>
        )}
      </div>

      {/* Action Buttons */}
      <div className="absolute left-[88px] top-[335px] flex items-center gap-[10px]">
        {/* Start / Action Button */}
        <CustomBtn
          label={buttonLabel}
          variant={buttonVariant}
          compactShadow
          iconSrc={buttonIcon}
          iconSize={{ width: 21, height: 22 }}
          textSize={18}
          strokeWidth={4.5}
          strokeColor="#2e1406"
          onClick={() => onStartMission?.(level)}
          className="w-[249px] h-[42px]"
        />

        {/* Info Button */}
        <CustomBtn
          variant="gray"
          compactShadow
          iconSrc="/images/Question_Icon.svg"
          iconSize={{ width: 15, height: 20 }}
          iconClassName="mb-0.5"
          onClick={() => onInfoClick?.(level)}
          className="size-[42px] shrink-0"
        />
      </div>

      {/* Banner (scaled to 379:54) */}
      <div className="absolute left-[36px] top-[12px] w-[379px] h-[54px] pointer-events-none select-none">
        <div className="absolute inset-[0_-1.25%_-17.39%_-0.82%]">
          <img
            src={level.bannerImage || "/images/Banner_Red.svg"}
            alt=""
            draggable={false}
            className="block size-full max-w-none"
          />
        </div>

        {/* Header Title Text */}
        <div
          className={`absolute left-[26px] top-[6px] ${
            isCompleted ? "w-[275px]" : "w-[345px]"
          } h-[42px] flex items-center`}
        >
          <span
            className="font-['Mitr'] font-medium text-[22px] text-white truncate leading-normal"
            style={{
              WebkitTextStroke: "4.5px #2e1406",
              paintOrder: "stroke fill",
            }}
          >
            {level.header}
          </span>
        </div>

        {/* Checkmark Badge */}
        {isCompleted && (
          <div className="absolute right-[12px] top-1/2 -translate-y-[54%] w-[64px] h-[64px] flex items-center justify-center pointer-events-none">
            <img
              src="/images/Checkmark.svg"
              alt=""
              draggable={false}
              className="w-full h-full object-contain pointer-events-none"
            />
          </div>
        )}
      </div>

      {/* Timeline Node */}
      <div className="absolute left-0 top-[27px] size-[31px] pointer-events-none">
        <img
          src="/images/Timeline_Node.svg"
          alt=""
          draggable={false}
          className="block w-full h-full object-contain"
        />
      </div>
    </div>
  );
};

export default MissionLevelBox;
