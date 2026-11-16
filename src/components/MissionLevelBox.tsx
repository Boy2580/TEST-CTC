import CustomBtn from "./CustomBtn";
import type { MissionLevelData } from "../data/missionsData";

export interface MissionLevelBoxProps {
  level: MissionLevelData;
  topPx: number;
  onStartMission?: (level: MissionLevelData) => void;
  onInfoClick?: (level: MissionLevelData) => void;
}

export const MissionLevelBox = ({
  level,
  topPx,
  onStartMission,
  onInfoClick,
}: MissionLevelBoxProps) => {
  return (
    <div
      className="absolute left-0 w-[355px] h-[344px] select-none"
      style={{ top: `${topPx}px` }}
    >
      {/* Card Frame */}
      <div className="absolute left-[59px] top-0 w-[286px] h-[344px]">
        <div className="w-[286px] h-[344px] bg-[#6f695e] border-[3px] border-[#2e1406] rounded-[10px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]" />
        <div className="absolute inset-x-0 top-0 w-[286px] h-[338.5px] bg-[#f2f2d8] border-[3px] border-[#a6a198] rounded-[10px]" />
      </div>

      {/* Preview Image */}
      <div className="absolute left-[74px] top-[67px] w-[255px] h-[132px] border-[3px] border-[#2e1406] rounded-[5px] overflow-hidden bg-[#2e1406]">
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
      <div className="absolute left-[74px] top-[206px] w-[255px] font-['Mitr'] font-normal text-[15px] text-[#2e1406] leading-[1.38] tracking-[0.2px]">
        <span>{level.desc} </span>
        {level.highlightText && (
          <span className="font-medium text-[#e4262a]">
            {level.highlightText}
          </span>
        )}
      </div>

      {/* Action Buttons */}
      <div className="absolute left-[76px] top-[284px] flex items-center gap-[10px]">
        {/* Start Mission Button */}
        <CustomBtn
          label="เริ่มภารกิจ"
          variant="yellow"
          compactShadow
          iconSrc="/images/Hand_Icon.svg"
          iconSize={{ width: 18, height: 19 }}
          textSize={16}
          strokeWidth={4}
          strokeColor="#2e1406"
          onClick={() => onStartMission?.(level)}
          className="w-[208px] h-[36px]"
        />

        {/* Info Button */}
        <CustomBtn
          variant="gray"
          compactShadow
          iconSrc="/images/Question_Icon.svg"
          iconSize={{ width: 13, height: 18 }}
          iconClassName="mb-0.5"
          onClick={() => onInfoClick?.(level)}
          title="รายละเอียดภารกิจ"
          className="size-[36px] shrink-0"
        />
      </div>

      {/* Banner */}
      <div className="absolute left-[31px] top-[10px] w-[321px] h-[46px] pointer-events-none select-none">
        <div className="absolute inset-[0_-1.25%_-17.39%_-0.82%]">
          <img
            src={level.bannerImage || "/images/Banner_Red.svg"}
            alt=""
            draggable={false}
            className="block size-full max-w-none"
          />
        </div>

        {/* Header Title Text */}
        <div className="absolute left-[22px] top-[5px] w-[292px] h-[35px] flex items-center">
          <span
            className="font-['Mitr'] font-medium text-[20px] text-white truncate leading-normal"
            style={{
              WebkitTextStroke: "4px #2e1406",
              paintOrder: "stroke fill",
            }}
          >
            {level.header}
          </span>
        </div>
      </div>

      {/* Timeline Node */}
      <div className="absolute left-0 top-[23px] size-[26px] pointer-events-none">
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
