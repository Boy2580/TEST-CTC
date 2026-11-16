import { useState } from "react";
import { CustomBtn } from "./CustomBtn";

export interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const LogoutModal = ({
  isOpen,
  onClose,
  onConfirm,
}: LogoutModalProps) => {
  const [closing, setClosing] = useState(false);

  if (!isOpen) return null;

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      setClosing(false);
      onClose();
    }, 200);
  };

  const handleConfirm = () => {
    setClosing(true);
    setTimeout(() => {
      setClosing(false);
      onConfirm();
    }, 200);
  };

  return (
    <div className="absolute inset-0 z-40 w-full h-full overflow-hidden select-none flex items-center justify-center">
      {/* Blackout Backdrop */}
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
        <div className="absolute -top-[28px] left-1/2 -translate-x-1/2 z-20 pointer-events-none">
          <CustomBtn
            variant="red"
            iconSrc="/images/Logout_Icon.svg"
            iconSize={26}
            iconClassName="mb-1"
            className="size-[54px]"
          />
        </div>

        <div className="relative bg-gradient-to-b from-[#1e0202] to-[#202020] border-[4px] border-[#f7daa4] rounded-[22px] opacity-95 pt-[40px] pb-[24px] px-[24px] flex flex-col items-center">
          <h2 className="font-['Mitr'] font-medium text-[28px] text-white text-center leading-none">
            ออกจากระบบ
          </h2>

          <p className="font-['Mitr'] font-normal text-[16px] text-white/75 text-center leading-snug mt-[12px] max-w-[260px]">
            คุณแน่ใจหรือไม่ว่าต้องการออกจากระบบ?
          </p>

          {/* Action buttons */}
          <div className="flex items-center justify-center gap-[14px] w-full mt-[22px]">
            <CustomBtn
              type="button"
              label="ยกเลิก"
              textSize={16}
              onClick={handleClose}
              className="!w-[125px] !h-[42px]"
            />

            <CustomBtn
              type="button"
              variant="red"
              label="ยืนยัน"
              textSize={16}
              onClick={handleConfirm}
              className="!w-[125px] !h-[42px]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;
