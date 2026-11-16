import type React from "react";

export interface CustomBtnProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
  iconSrc?: string;
  iconSize?: number | string | { width?: number | string; height?: number | string };
  iconWidth?: number | string;
  iconHeight?: number | string;
  iconClassName?: string;
  textSize?: number | string;
  textClassName?: string;
  strokeWidth?: number | string;
  strokeColor?: string;
  variant?: "yellow" | "red" | "gray";
  compactShadow?: boolean;
  className?: string;
}

const toPx = (val?: number | string) => {
  if (val === undefined || val === null) return undefined;
  return typeof val === "number" ? `${val}px` : val;
};

export const CustomBtn: React.FC<CustomBtnProps> = ({
  label,
  iconSrc,
  iconSize,
  iconWidth,
  iconHeight,
  iconClassName = "",
  textSize,
  textClassName = "",
  strokeWidth,
  strokeColor,
  variant = "yellow",
  compactShadow = false,
  className = "",
  onClick,
  ...props
}) => {
  const isRed = variant === "red";
  const isGray = variant === "gray";
  const hasWidth = className.includes("size-") || className.includes("w-");
  const hasHeight = className.includes("size-") || className.includes("h-");
  const sizeDefaults = [!hasWidth && "w-[232px]", !hasHeight && "h-[48px]"]
    .filter(Boolean)
    .join(" ");

  const resolvedWidth =
    typeof iconSize === "object"
      ? toPx(iconSize.width)
      : toPx(iconWidth ?? iconSize) ?? (label ? "22.5px" : "28px");

  const resolvedHeight =
    typeof iconSize === "object"
      ? toPx(iconSize.height)
      : toPx(iconHeight ?? iconSize) ?? (label ? "24px" : "28px");

  const resolvedTextSize = toPx(textSize);
  const strokeW = toPx(strokeWidth) ?? "4px";
  const strokeC = strokeColor ?? (isRed ? "#380303" : "#2e1406");

  return (
    <button
      type="button"
      onClick={onClick}
      className={`btn-squish group relative ${sizeDefaults} cursor-pointer focus:outline-none select-none ${className}`}
      {...props}
    >
      {/* Shadow base */}
      <div
        className={`absolute rounded-[8px] ${
          compactShadow
            ? "-inset-x-[2px] -top-[2px] h-[calc(100%+4px)]"
            : "-inset-x-[3.5px] -top-[3.5px] h-[calc(100%+7px)]"
        } ${
          isRed
            ? compactShadow
              ? "bg-[#7d2e21] border-[2px] border-[#380303]"
              : "bg-[#7d2e21] border-[3px] border-[#380303]"
            : isGray
            ? compactShadow
              ? "bg-[#4a4a4a] border-[2px] border-[#222222]"
              : "bg-[#4a4a4a] border-[3px] border-[#222222]"
            : compactShadow
            ? "bg-[#cd5541] border-[2.5px] border-[#2e1406]"
            : "bg-[#cd5541] border-[3.5px] border-[#2e1406]"
        }`}
      />

      {/* Inner frame */}
      <div
        className={`absolute top-0 left-0 w-full rounded-[6px] transition-colors ${
          compactShadow ? "h-[calc(100%-2.5px)]" : "h-[calc(100%-4px)]"
        } ${
          isRed
            ? compactShadow
              ? "bg-[#cd5541] group-hover:bg-[#d9614d] border-[2px] border-[#ff9281]"
              : "bg-[#cd5541] group-hover:bg-[#d9614d] border-[3px] border-[#ff9281]"
            : isGray
            ? compactShadow
              ? "bg-[#808080] group-hover:bg-[#8e8e8e] border-[2px] border-[#c0c0c0]"
              : "bg-[#808080] group-hover:bg-[#8e8e8e] border-[3px] border-[#c0c0c0]"
            : compactShadow
            ? "bg-[#fec559] group-hover:bg-[#ffd074] border-[2.5px] border-[#f7daa4]"
            : "bg-[#fec559] group-hover:bg-[#ffd074] border-[4px] border-[#f7daa4]"
        }`}
      />

      {/* Label and icon */}
      <div
        className={`relative z-10 flex items-center justify-center h-[calc(100%-4px)] ${
          label ? "gap-2.5 px-4" : "w-full"
        }`}
      >
        {iconSrc && (
          <div
            className={`shrink-0 flex items-center justify-center mb-1 ${iconClassName}`}
            style={{
              width: resolvedWidth,
              height: resolvedHeight,
            }}
          >
            <img
              src={iconSrc}
              alt=""
              aria-hidden="true"
              draggable={false}
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
              style={{
                width: resolvedWidth,
                height: resolvedHeight,
              }}
              className="max-w-none object-contain select-none"
            />
          </div>
        )}

        {label && (
          <span
            style={{
              ...(resolvedTextSize ? { fontSize: resolvedTextSize } : {}),
              WebkitTextStroke: `${strokeW} ${strokeC}`,
              paintOrder: "stroke fill",
            }}
            className={`font-['Mitr'] text-white font-medium ${
              resolvedTextSize ? "" : "text-[20px]"
            } mb-0.5 leading-none ${textClassName}`}
          >
            {label}
          </span>
        )}
      </div>
    </button>
  );
};

export default CustomBtn;
