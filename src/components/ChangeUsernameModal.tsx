import { useState } from "react";
import { CustomBtn } from "./CustomBtn";
import { setNameApi } from "../api/services/userControl";

export interface ChangeUsernameModalProps {
  isOpen: boolean;
  currentUsername: string;
  onClose: () => void;
  onSuccess: (newUsername: string) => void;
}

export const ChangeUsernameModal = ({
  isOpen,
  currentUsername,
  onClose,
  onSuccess,
}: ChangeUsernameModalProps) => {
  const [closing, setClosing] = useState(false);
  const [newUsername, setNewUsername] = useState(currentUsername);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen) return null;

  const handleClose = () => {
    if (isLoading) return;
    setClosing(true);
    setTimeout(() => {
      setClosing(false);
      onClose();
    }, 200);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newUsername.trim();

    if (!trimmed) {
      setErrorMsg("กรุณาระบุชื่อผู้ใช้");
      return;
    }

    if (trimmed.length > 20) {
      setErrorMsg("ชื่อผู้ใช้ต้องมีความยาวไม่เกิน 20 ตัวอักษร");
      return;
    }

    if (trimmed === currentUsername) {
      handleClose();
      return;
    }

    try {
      setErrorMsg("");
      setIsLoading(true);
      await setNameApi(trimmed);
      setIsLoading(false);
      setClosing(true);
      setTimeout(() => {
        setClosing(false);
        onSuccess(trimmed);
        onClose();
      }, 200);
    } catch (err: unknown) {
      setIsLoading(false);
      const message =
        typeof err === "string"
          ? err
          : "ไม่สามารถบันทึกชื่อผู้ใช้ได้ กรุณาลองใหม่อีกครั้ง";
      setErrorMsg(message);
    }
  };

  return (
    <div className="absolute inset-0 z-50 w-full h-full overflow-hidden select-none flex items-center justify-center">
      {/* Blackout Backdrop */}
      <div
        onClick={handleClose}
        className={`absolute inset-0 bg-[rgba(0,0,0,0.55)] transition-opacity duration-250 ${
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

        <form
          onSubmit={handleSubmit}
          noValidate
          className="relative bg-gradient-to-b from-[#1e0202] to-[#202020] border-[4px] border-[#f7daa4] rounded-[22px] opacity-95 pt-[26px] pb-[24px] px-[24px] flex flex-col items-center"
        >
          <h2 className="font-['Mitr'] font-medium text-[26px] text-white text-center leading-none">
            เปลี่ยนชื่อผู้ใช้
          </h2>

          <p className="font-['Mitr'] font-normal text-[15px] text-white/75 text-center leading-snug mt-[8px] max-w-[260px]">
            กรุณาระบุชื่อผู้ใช้ใหม่ที่ต้องการแสดงในระบบ
          </p>

          {/* Input field */}
          <div className="mt-[18px] border-2 border-white/75 focus-within:border-[#fec559] h-[40px] w-full max-w-[260px] rounded-[10px] flex items-center px-[12px] bg-black/25 transition-colors">
            <input
              type="text"
              value={newUsername}
              maxLength={20}
              disabled={isLoading}
              onChange={(e) => {
                setNewUsername(e.target.value);
                if (errorMsg) setErrorMsg("");
              }}
              placeholder="ชื่อผู้ใช้ (ไม่เกิน 20 ตัวอักษร)"
              autoFocus
              className="w-full bg-transparent font-['Mitr'] font-normal text-[16px] text-white placeholder-white/45 focus:outline-none leading-none disabled:opacity-50"
            />
          </div>

          {errorMsg && (
            <p className="mt-[8px] font-['Mitr'] font-normal text-[13px] text-[#fe595c] text-center leading-tight">
              {errorMsg}
            </p>
          )}

          {/* Action buttons */}
          <div className="flex items-center justify-center gap-[14px] w-full mt-[20px]">
            <CustomBtn
              type="button"
              variant="red"
              label="ยกเลิก"
              textSize={16}
              disabled={isLoading}
              onClick={handleClose}
              className="!w-[125px] !h-[42px]"
            />

            <CustomBtn
              type="submit"
              variant="yellow"
              label={isLoading ? "กำลังบันทึก..." : "ยืนยัน"}
              textSize={16}
              disabled={isLoading}
              className="!w-[125px] !h-[42px]"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangeUsernameModal;
