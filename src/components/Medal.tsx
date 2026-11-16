import { MEDALS_DATA } from "../data/medalsData";

export interface MedalProps {
  id: number;
  unlocked?: boolean;
  iconSrc?: string;
  bgColor?: string;
  strokeColor?: string;
  borderColor?: string;
  size?: "sm" | "lg";
  onClick?: () => void;
  className?: string;
}

export const Medal = ({
  id,
  unlocked = false,
  iconSrc,
  bgColor,
  strokeColor,
  borderColor,
  size = "sm",
  onClick,
  className = "",
}: MedalProps) => {
  const isLarge = size === "lg";
  const medalInfo = MEDALS_DATA[id];

  const finalIconSrc = iconSrc ?? medalInfo?.iconSrc ?? "/images/Apple_Icon.png";
  const activeBg = bgColor ?? medalInfo?.bgColor ?? "#a9a9a9";
  const activeStroke =
    strokeColor ?? borderColor ?? medalInfo?.strokeColor ?? medalInfo?.borderColor ?? "rgba(0, 0, 0, 0.5)";

  const isGradient = activeBg.includes("gradient");

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Medal ${id} (${unlocked ? "Unlocked" : "Locked"})`}
      className={`btn-squish relative overflow-hidden cursor-pointer focus:outline-none select-none ${
        isLarge
          ? "size-[90px] rounded-[15px] shadow-lg"
          : "size-[52px] rounded-[7px]"
      } ${className}`}
    >
      {/* Medal box */}
      <div
        className={`absolute inset-0 ${
          isLarge
            ? "border-[5px] rounded-[15px]"
            : "border-[3.5px] rounded-[8px]"
        }`}
        style={{
          ...(isGradient ? { background: activeBg } : { backgroundColor: activeBg }),
          borderColor: activeStroke,
        }}
      />

      {/* Icon */}
      <div
        className={`absolute flex items-center justify-center ${
          isLarge ? "inset-[10px]" : "inset-[7px]"
        }`}
      >
        <img
          alt=""
          src={finalIconSrc}
          draggable={false}
          className="w-[90%] h-[90%] object-contain pointer-events-none select-none"
        />
      </div>

      {/* Shine gleam on unlocked medal */}
      {unlocked && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="animate-medal-shine absolute -inset-y-1 -left-full w-full bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none"
            style={{ animationDelay: `${(id % 4) * 0.45}s` }}
          />
        </div>
      )}

      {/* Lock overlay when locked */}
      {!unlocked && (
        <div
          className={`absolute inset-0 bg-black/75 flex items-center justify-center ${
            isLarge
              ? "rounded-[15px]"
              : "rounded-[8px]"
          }`}
        >
          <div className={isLarge ? "size-[42px]" : "size-[26px]"}>
            <img
              alt="Locked"
              src="/images/Lock_Icon.svg"
              draggable={false}
              className="w-full h-full object-contain pointer-events-none select-none"
            />
          </div>
        </div>
      )}
    </button>
  );
};

export default Medal;
