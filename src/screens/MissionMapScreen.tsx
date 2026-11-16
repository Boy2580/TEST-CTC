import { useEffect, useRef, useState } from "react";
import CustomBtn from "../components/CustomBtn";
import { MissionLevelBox } from "../components/MissionLevelBox";
import { MISSIONS_DATA, type MissionLevelData } from "../data/missionsData";

export interface MissionMapScreenProps {
  onBack?: () => void;
  onSelectMission?: (mission: MissionLevelData) => void;
}

export const MissionMapScreen = ({
  onBack,
  onSelectMission,
}: MissionMapScreenProps) => {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragStateRef = useRef({
    isDown: false,
    startY: 0,
    scrollTop: 0,
  });

  // Start scrolled at the top
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    requestAnimationFrame(() => {
      el.scrollTop = 0;
    });
  }, []);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = scrollContainerRef.current;
    if (!el) return;
    dragStateRef.current = {
      isDown: true,
      startY: e.clientY,
      scrollTop: el.scrollTop,
    };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = scrollContainerRef.current;
    if (!el || !dragStateRef.current.isDown) return;
    const deltaY = e.clientY - dragStateRef.current.startY;
    if (Math.abs(deltaY) > 4 && !isDragging) {
      setIsDragging(true);
    }
    el.scrollTop = dragStateRef.current.scrollTop - deltaY;
  };

  const handleMouseUpOrLeave = () => {
    dragStateRef.current.isDown = false;
    if (isDragging) {
      setTimeout(() => setIsDragging(false), 0);
    }
  };

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#1a0909] select-none">
      {/* Scrollable Map */}
      <div
        ref={scrollContainerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
        className={`w-full h-full overflow-y-auto overflow-x-hidden no-scrollbar ${
          isDragging ? "cursor-grabbing" : "cursor-grab"
        }`}
        style={{
          WebkitOverflowScrolling: "touch",
          touchAction: "pan-y",
        }}
      >
        {/* Map Canvas */}
        <div className="relative w-full h-[2385px]">
          {/* Map Background */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <img
              src="/images/Map_Bg.png"
              alt=""
              draggable={false}
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            />
            <div className="absolute inset-0 bg-[rgba(0,0,0,0.35)]" />
            <div className="absolute inset-0 shadow-[inset_0px_4px_150px_50px_rgba(0,0,0,0.25)]" />
          </div>

          {/* Centered Column */}
          <div className="relative mx-auto w-[402px] max-w-full h-full">
            {/* Timeline Line */}
            <div className="absolute left-[14.5px] top-[56px] w-[31px] h-[2310px] pointer-events-none flex items-center justify-center">
              <img
                src="/images/Timeline_Line.svg"
                alt=""
                draggable={false}
                className="w-[31px] h-[2310px] object-fill pointer-events-none"
              />
            </div>

            {/* Level Cards */}
            <div className="absolute left-[17px] top-0 w-[355px] h-full">
              {MISSIONS_DATA.map((level, index) => {
                const topPx = 127 + index * 370;
                return (
                  <MissionLevelBox
                    key={level.id}
                    level={level}
                    topPx={topPx}
                    onStartMission={(lv) => {
                      if (!isDragging) onSelectMission?.(lv);
                    }}
                    onInfoClick={(lv) => {
                      if (!isDragging) onSelectMission?.(lv);
                    }}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Top Header */}
      <div className="absolute top-0 inset-x-0 z-20 h-[148px] bg-gradient-to-b from-black from-[-35%] to-transparent pointer-events-none">
        <div className="relative mx-auto w-full max-w-[485px] h-full px-[20px] flex items-start justify-between pt-[25px]">
          {/* Title & Subtitle */}
          <div className="flex flex-col gap-[2px] max-w-[270px]">
            <h1
              className="font-['Mitr'] font-medium text-[24px] text-white leading-tight"
              style={{
                WebkitTextStroke: "7px #2e1406",
                paintOrder: "stroke fill",
              }}
            >
              แผนที่สำรวจ
            </h1>
            <p
              className="font-['Mitr'] font-normal text-[15px] text-white leading-snug"
              style={{
                WebkitTextStroke: "5px #2e1406",
                paintOrder: "stroke fill",
              }}
            >
              แตะที่ปุ่ม ? เพื่อดูรายละเอียดภารกิจ
            </p>
          </div>

          {/* Back Button */}
          <CustomBtn
            label="กลับ"
            variant="red"
            iconSrc="/images/Back_Icon.svg"
            iconSize={24}
            textSize={18}
            strokeWidth={5}
            strokeColor="#380303"
            onClick={onBack}
            className="pointer-events-auto shrink-0 w-[96px] h-[44px]"
          />
        </div>
      </div>
    </div>
  );
};

export default MissionMapScreen;
