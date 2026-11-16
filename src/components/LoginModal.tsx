import { useState, useRef, useEffect } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import {
  googleLoginApi,
  registerApi,
  verifyOtpApi,
  resendOtpApi,
  loginApi,
} from "../api/service/authApi.ts";
import { setNameApi } from "../api/service/userControl.ts";
import { unlockAchievement } from "../utils/achievementHelper.ts";

interface LoginModalProps {
  isOpen: boolean;
  onClose?: () => void;
  onLoginSuccess: (username: string) => void;
}

type ModalMode = "login" | "register" | "otp" | "username";

export const LoginModal = ({
  isOpen,
  onLoginSuccess,
}: LoginModalProps) => {
  const [mode, setMode] = useState<ModalMode>("login");

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");

  const [otpDigits, setOtpDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [infoMsg, setInfoMsg] = useState("");
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [customUsername, setCustomUsername] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [closing, setClosing] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authMessage, setAuthMessage] = useState("กำลังลงชื่อเข้าใช้");

  // ฟังก์ชันสำหรับเทสต์กดที่โลโก้เพื่อปลดล็อก Achievement (เช่น ทดสอบปลดล็อกเหรียญที่ 1)
  const handleTestUnlockAchievement = async () => {
    const testMedalId = 1; // เปลี่ยนเลขเหรียญตรงนี้ได้ตามต้องการ
    console.log(`กำลังทดสอบปลดล็อกเหรียญที่ ${testMedalId}...`);
    
    await unlockAchievement(testMedalId, () => {
      alert(`ยินดีด้วย! ทดสอบปลดล็อกเหรียญที่ ${testMedalId} สำเร็จ`);
    });
  };

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  useEffect(() => {
    if (mode === "otp" && isOpen) {
      const timeout = setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [mode, isOpen]);

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const data = await googleLoginApi(tokenResponse.access_token);

        if (data.token) {
          localStorage.setItem("token", data.token);
        }

        if (data.user?.name) {
          const userName = data.user.name;
          resetAndFinish(() => {
            setIsAuthenticating(false);
            onLoginSuccess(userName);
          });
        } else {
          setIsAuthenticating(false);
          setMode("username");
        }
      } catch (err: unknown) {
        setIsAuthenticating(false);
        const message =
          typeof err === "string" ? err : "ไม่สามารถเข้าสู่ระบบด้วย Google ได้";
        setErrorMsg(message);
      }
    },
    onError: () => {
      setIsAuthenticating(false);
      setErrorMsg("การเข้าสู่ระบบด้วย Google ล้มเหลว");
    },
    onNonOAuthError: () => {
      setIsAuthenticating(false);
    },
  });

  if (!isOpen) return null;

  const switchMode = (nextMode: ModalMode) => {
    setErrorMsg("");
    setInfoMsg("");
    setMode(nextMode);
  };

  const resetAndFinish = (callback: () => void) => {
    setClosing(true);
    setTimeout(() => {
      setClosing(false);
      setMode("login");
      setErrorMsg("");
      setInfoMsg("");
      setOtpDigits(["", "", "", "", "", ""]);
      callback();
    }, 200);
  };

  const handleGoogleAuth = () => {
    setErrorMsg("");
    setInfoMsg("");
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) {
      setErrorMsg(
        "ระบบยังไม่ได้ตั้งค่า Google Client ID ในสภาพแวดล้อม (Vercel / .env)",
      );
      return;
    }
    setAuthMessage("กำลังลงชื่อเข้าใช้");
    setIsAuthenticating(true);
    googleLogin();
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = loginEmail.trim();
    if (!email || !loginPassword) {
      setErrorMsg("กรุณากรอกอีเมลและรหัสผ่าน");
      return;
    }
    if (!email.includes("@")) {
      setErrorMsg("รูปแบบอีเมลไม่ถูกต้อง (ต้องมี @)");
      return;
    }

    try {
      setErrorMsg("");
      setInfoMsg("");
      setAuthMessage("กำลังลงชื่อเข้าใช้");
      setIsAuthenticating(true);
      const data = await loginApi(email, loginPassword);

      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      if (data.payload?.name) {
        const userName = data.payload.name;
        resetAndFinish(() => {
          setIsAuthenticating(false);
          onLoginSuccess(userName);
        });
      } else {
        setIsAuthenticating(false);
        setMode("username");
      }
    } catch (err: unknown) {
      setIsAuthenticating(false);
      const message =
        typeof err === "string" ? err : "อีเมลหรือรหัสผ่านไม่ถูกต้อง";
      if (message.includes("OTP")) {
        setRegEmail(email);
        setRegPassword(loginPassword);
        setOtpDigits(["", "", "", "", "", ""]);
        setMode("otp");
        setErrorMsg(message);
        return;
      }
      setErrorMsg(message);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const email = regEmail.trim();
    if (!email || !regPassword || !regConfirmPassword) {
      setErrorMsg("กรุณากรอกข้อมูลให้ครบทุกช่อง");
      return;
    }
    if (!email.includes("@")) {
      setErrorMsg("รูปแบบอีเมลไม่ถูกต้อง (ต้องมี @)");
      return;
    }
    if (regPassword.length < 8) {
      setErrorMsg("รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร");
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setErrorMsg("รหัสผ่านและการยืนยันรหัสผ่านไม่ตรงกัน");
      return;
    }

    try {
      setErrorMsg("");
      setInfoMsg("");
      setMode("otp");
      setOtpDigits(["", "", "", "", "", ""]);
      setResendCooldown(30);
      setInfoMsg("กำลังส่งรหัส OTP 6 หลักไปยังอีเมลของคุณ...");

      await registerApi(email, regPassword);
      setInfoMsg("ส่งรหัส OTP 6 หลักไปยังอีเมลของคุณแล้ว");
    } catch (err: unknown) {
      const message =
        typeof err === "string"
          ? err
          : "ไม่สามารถสมัครสมาชิกได้ กรุณาลองใหม่อีกครั้ง";
      setErrorMsg(message);
    }
  };

  const handleOtpDigitChange = (index: number, value: string) => {
    const cleaned = value.replace(/\D/g, "");
    if (!cleaned) {
      const next = [...otpDigits];
      next[index] = "";
      setOtpDigits(next);
      return;
    }

    if (cleaned.length > 1) {
      const next = [...otpDigits];
      for (let i = 0; i < cleaned.length && index + i < 6; i++) {
        next[index + i] = cleaned[i];
      }
      setOtpDigits(next);
      const focusIndex = Math.min(index + cleaned.length, 5);
      otpInputRefs.current[focusIndex]?.focus();
      if (errorMsg) setErrorMsg("");
      return;
    }

    const digit = cleaned.slice(-1);
    const next = [...otpDigits];
    next[index] = digit;
    setOtpDigits(next);
    if (errorMsg) setErrorMsg("");

    if (index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace") {
      if (otpDigits[index]) {
        const next = [...otpDigits];
        next[index] = "";
        setOtpDigits(next);
      } else if (index > 0) {
        const next = [...otpDigits];
        next[index - 1] = "";
        setOtpDigits(next);
        otpInputRefs.current[index - 1]?.focus();
      }
      e.preventDefault();
    } else if (e.key === "ArrowLeft" && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
      e.preventDefault();
    } else if (e.key === "ArrowRight" && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
      e.preventDefault();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    const next = ["", "", "", "", "", ""];
    for (let i = 0; i < 6; i++) {
      next[i] = pasted[i] || "";
    }
    setOtpDigits(next);
    if (errorMsg) setErrorMsg("");
    const focusIndex = Math.min(pasted.length, 5);
    otpInputRefs.current[focusIndex]?.focus();
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otpDigits.join("");
    if (code.length < 6) {
      setErrorMsg("กรุณากรอกรหัส OTP ให้ครบ 6 หลัก");
      return;
    }

    try {
      setErrorMsg("");
      setInfoMsg("");
      setAuthMessage("กำลังตรวจสอบรหัส OTP");
      setIsAuthenticating(true);
      const email = regEmail.trim() || loginEmail.trim();
      await verifyOtpApi(email, code);

      setIsAuthenticating(false);
      setInfoMsg("ยืนยันอีเมลสำเร็จ! กรุณาเข้าสู่ระบบ");
      setOtpDigits(["", "", "", "", "", ""]);
      setMode("login");
    } catch (err: unknown) {
      setIsAuthenticating(false);
      const message =
        typeof err === "string" ? err : "รหัส OTP ไม่ถูกต้องหรือหมดอายุ";
      setErrorMsg(message);
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;
    const email = regEmail.trim() || loginEmail.trim();
    if (!email) {
      setErrorMsg("ไม่พบอีเมลสำหรับส่งรหัส OTP");
      return;
    }

    try {
      setErrorMsg("");
      setInfoMsg("");
      setAuthMessage("กำลังส่งรหัส OTP");
      setIsAuthenticating(true);
      await resendOtpApi(email);
      setIsAuthenticating(false);
      setOtpDigits(["", "", "", "", "", ""]);
      setResendCooldown(30);
      setInfoMsg("ส่งรหัส OTP ใหม่ไปยังอีเมลของคุณแล้ว");
      otpInputRefs.current[0]?.focus();
    } catch (err: unknown) {
      setIsAuthenticating(false);
      const message =
        typeof err === "string"
          ? err
          : "ไม่สามารถส่งรหัส OTP ใหม่ได้ กรุณาลองใหม่อีกครั้ง";
      setErrorMsg(message);
    }
  };

  const handleUsernameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = customUsername.trim();
    if (!trimmed) {
      setErrorMsg("กรุณาตั้งชื่อผู้ใช้ของคุณ");
      return;
    }
    if (trimmed.length > 20) {
      setErrorMsg("ชื่อผู้ใช้ต้องมีความยาวไม่เกิน 20 ตัวอักษร");
      return;
    }

    try {
      setErrorMsg("");
      setInfoMsg("");
      setAuthMessage("กำลังบันทึกข้อมูล");
      setIsAuthenticating(true);
      await setNameApi(trimmed);
      resetAndFinish(() => {
        setIsAuthenticating(false);
        onLoginSuccess(trimmed);
      });
    } catch (err: unknown) {
      setIsAuthenticating(false);
      const message =
        typeof err === "string"
          ? err
          : "ไม่สามารถบันทึกชื่อผู้ใช้ได้ กรุณาลองใหม่อีกครั้ง";
      setErrorMsg(message);
    }
  };

  return (
    <div className="absolute inset-0 z-40 w-full h-full overflow-hidden select-none flex items-center justify-center">
      <div
        className={`absolute inset-0 bg-[rgba(0,0,0,0.35)] transition-opacity duration-250 ${
          closing ? "opacity-0" : "animate-backdrop-in"
        }`}
      />

      {isAuthenticating && (
        <div className="absolute inset-0 z-50 bg-black/85 backdrop-blur-[2px] flex flex-col items-center justify-center animate-backdrop-in pointer-events-auto">
          <div className="flex items-center space-x-2.5">
            <span className="w-4 h-4 bg-[#fec559] border-3 border-[#2E1406] rounded-full animate-bounce [animation-delay:-0.3s]"></span>
            <span className="w-4 h-4 bg-[#fec559] border-3 border-[#2E1406] rounded-full animate-bounce [animation-delay:-0.15s]"></span>
            <span className="w-4 h-4 bg-[#fec559] border-3 border-[#2E1406] rounded-full animate-bounce"></span>
          </div>
          <p className="mt-5 font-['Mitr'] font-medium text-[16px] text-white/90 text-center tracking-wide">
            {authMessage}
          </p>
        </div>
      )}

      <div
        key={mode}
        className={`relative z-10 w-[341px] pointer-events-auto ${
          closing ? "animate-popup-out" : "animate-popup-in"
        }`}
      >
        <div className="absolute -inset-x-[3.5px] -top-[3.5px] -bottom-[7.5px] bg-[#cd5541] border-[3.5px] border-[#2e1406] rounded-[24px] shadow-[0_16px_40px_rgba(0,0,0,0.65)] pointer-events-none" />

        {mode === "otp" ? (
          <div 
            onClick={handleTestUnlockAchievement}
            className="absolute -top-[35px] left-1/2 -translate-x-1/2 w-[65px] h-[65px] z-20 cursor-pointer flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
            title="คลิกเพื่อทดสอบปลดล็อก Achievement"
          >
            <img
              alt="Key"
              className="block w-[65px] h-[65px] object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)] pointer-events-none"
              src="/images/Key_Icon.svg"
              draggable={false}
            />
          </div>
        ) : mode !== "username" ? (
          <div 
            onClick={handleTestUnlockAchievement}
            className="absolute -top-[35px] left-1/2 -translate-x-1/2 w-[63px] h-[62px] z-20 cursor-pointer transition-transform hover:scale-110 active:scale-95"
            title="คลิกเพื่อทดสอบปลดล็อก Achievement"
          >
            <div className="absolute inset-[9.38%_12.5%]">
              <img
                alt="Lock"
                className="block w-full h-full object-contain pointer-events-none"
                src="/images/Lock_Icon.svg"
                draggable={false}
              />
            </div>
          </div>
        ) : null}

        <div
          className={`relative bg-gradient-to-b from-[#1e0202] to-[#202020] border-[4px] border-[#f7daa4] rounded-[22px] opacity-95 pb-[24px] px-[24px] flex flex-col items-center ${
            mode === "username" ? "pt-[26px]" : "pt-[34px]"
          }`}
        >
          {mode === "login" && (
            <form
              onSubmit={handleLoginSubmit}
              noValidate
              className="w-full flex flex-col items-center"
            >
              <h2 className="font-['Mitr'] font-medium text-[30px] text-white text-center leading-none">
                เข้าสู่ระบบ
              </h2>
              <p className="font-['Mitr'] font-normal text-[16px] text-white/75 text-center leading-none mt-[10px]">
                เลือกเข้าสู่ระบบผ่าน Social หรืออีเมล
              </p>

              <button
                type="button"
                onClick={handleGoogleAuth}
                className="mt-[22px] border-[2.5px] border-white flex gap-[8px] h-[47px] w-[251px] items-center justify-center px-[20px] py-[10px] rounded-[10px] cursor-pointer btn-squish shadow-md"
                style={{
                  backgroundImage:
                    "linear-gradient(90deg, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.3) 100%), linear-gradient(90deg, rgb(254, 111, 89) 0%, rgb(255, 197, 86) 33.173%, rgb(154, 213, 109) 72.115%, rgb(66, 74, 188) 100%)",
                }}
              >
                <div className="bg-white relative rounded-[5px] shrink-0 size-[25px] flex items-center justify-center">
                  <img
                    alt="Google"
                    className="w-[15px] h-[16px] object-contain pointer-events-none"
                    src="/images/Google_Icon.png"
                    draggable={false}
                  />
                </div>
                <span className="font-['Mitr'] font-medium text-[16px] text-white whitespace-nowrap leading-none">
                  เข้าสู่ระบบด้วย Google
                </span>
              </button>

              <div className="relative w-[251px] h-[22px] my-[12px] flex items-center justify-center">
                <img
                  alt=""
                  className="w-full h-[3px] object-contain pointer-events-none"
                  src="/images/Sep.svg"
                  draggable={false}
                />
                <span className="absolute font-['Mitr'] font-medium text-[13px] text-white/75 leading-none">
                  หรือ
                </span>
              </div>

              <div className="flex flex-col gap-[11px] w-[251px]">
                <div className="border-2 border-white/75 focus-within:border-[#fec559] h-[35px] w-full rounded-[10px] flex items-center px-[10.44px] transition-colors">
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => {
                      setLoginEmail(e.target.value);
                      if (errorMsg) setErrorMsg("");
                    }}
                    placeholder="อีเมล"
                    className="w-full bg-transparent font-['Mitr'] font-normal text-[16px] text-white placeholder-white/50 focus:outline-none leading-none"
                  />
                </div>

                <div className="border-2 border-white/75 focus-within:border-[#fec559] h-[35px] w-full rounded-[10px] flex items-center px-[10.44px] transition-colors">
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => {
                      setLoginPassword(e.target.value);
                      if (errorMsg) setErrorMsg("");
                    }}
                    placeholder="รหัสผ่าน"
                    className="w-full bg-transparent font-['Mitr'] font-normal text-[16px] text-white placeholder-white/50 focus:outline-none leading-none"
                  />
                </div>
              </div>

              {infoMsg && !errorMsg && (
                <p className="mt-[8px] font-['Mitr'] font-normal text-[13px] text-[#8be28b] text-center leading-tight">
                  {infoMsg}
                </p>
              )}

              {errorMsg && (
                <p className="mt-[8px] font-['Mitr'] font-normal text-[13px] text-[#fe595c] text-center leading-tight">
                  {errorMsg}
                </p>
              )}

              <button
                type="submit"
                className="group relative mt-[18px] w-[146px] h-[38px] cursor-pointer btn-squish focus:outline-none select-none"
              >
                <div className="absolute -inset-x-[3.5px] -top-[3.5px] h-[46px] bg-[#cd5541] border-[3.5px] border-[#2e1406] rounded-[10px]" />
                <div className="absolute top-0 left-0 w-full h-[36px] bg-[#fec559] group-hover:bg-[#ffd074] border-[4px] border-[#f7daa4] rounded-[8px] transition-colors flex items-center justify-center">
                  <span className="font-['Mitr'] font-medium text-[16px] text-white [-webkit-text-stroke:5px_#2e1406] [paint-order:stroke_fill] leading-none mb-0.5">
                    เข้าสู่ระบบ
                  </span>
                </div>
              </button>

              <p className="mt-[18px] font-['Mitr'] font-normal text-[16px] text-white/75 text-center leading-none opacity-90">
                <span>ยังไม่มีบัญชี? </span>
                <button
                  type="button"
                  onClick={() => switchMode("register")}
                  className="font-['Mitr'] font-medium text-[#fe595c] hover:underline cursor-pointer"
                >
                  สมัครสมาชิก
                </button>
              </p>
            </form>
          )}

          {mode === "register" && (
            <form
              onSubmit={handleRegisterSubmit}
              noValidate
              className="w-full flex flex-col items-center"
            >
              <h2 className="font-['Mitr'] font-medium text-[30px] text-white text-center leading-none">
                สมัครสมาชิก
              </h2>
              <p className="font-['Mitr'] font-normal text-[16px] text-white/75 text-center leading-none mt-[10px]">
                กรอกอีเมลและรหัสผ่านเพื่อสร้างบัญชี
              </p>

              <div className="flex flex-col gap-[10px] w-[251px] mt-[20px]">
                <div className="border-2 border-white/75 focus-within:border-[#fec559] h-[35px] w-full rounded-[10px] flex items-center px-[10.44px] transition-colors">
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => {
                      setRegEmail(e.target.value);
                      if (errorMsg) setErrorMsg("");
                    }}
                    placeholder="อีเมล"
                    className="w-full bg-transparent font-['Mitr'] font-normal text-[16px] text-white placeholder-white/50 focus:outline-none leading-none"
                  />
                </div>

                <div className="border-2 border-white/75 focus-within:border-[#fec559] h-[35px] w-full rounded-[10px] flex items-center px-[10.44px] transition-colors">
                  <input
                    type="password"
                    value={regPassword}
                    minLength={8}
                    onChange={(e) => {
                      setRegPassword(e.target.value);
                      if (errorMsg) setErrorMsg("");
                    }}
                    placeholder="รหัสผ่าน (อย่างน้อย 8 ตัวอักษร)"
                    className="w-full bg-transparent font-['Mitr'] font-normal text-[16px] text-white placeholder-white/50 focus:outline-none leading-none"
                  />
                </div>

                <div className="border-2 border-white/75 focus-within:border-[#fec559] h-[35px] w-full rounded-[10px] flex items-center px-[10.44px] transition-colors">
                  <input
                    type="password"
                    value={regConfirmPassword}
                    onChange={(e) => {
                      setRegConfirmPassword(e.target.value);
                      if (errorMsg) setErrorMsg("");
                    }}
                    placeholder="ยืนยันรหัสผ่าน"
                    className="w-full bg-transparent font-['Mitr'] font-normal text-[16px] text-white placeholder-white/50 focus:outline-none leading-none"
                  />
                </div>
              </div>

              {errorMsg && (
                <p className="mt-[8px] font-['Mitr'] font-normal text-[13px] text-[#fe595c] text-center leading-tight">
                  {errorMsg}
                </p>
              )}

              <button
                type="submit"
                className="group relative mt-[16px] w-[146px] h-[38px] cursor-pointer btn-squish focus:outline-none select-none"
              >
                <div className="absolute -inset-x-[3.5px] -top-[3.5px] h-[46px] bg-[#cd5541] border-[3.5px] border-[#2e1406] rounded-[10px]" />
                <div className="absolute top-0 left-0 w-full h-[36px] bg-[#fec559] group-hover:bg-[#ffd074] border-[4px] border-[#f7daa4] rounded-[8px] transition-colors flex items-center justify-center">
                  <span className="font-['Mitr'] font-medium text-[16px] text-white [-webkit-text-stroke:5px_#2e1406] [paint-order:stroke_fill] leading-none mb-0.5">
                    สมัครสมาชิก
                  </span>
                </div>
              </button>

              <p className="mt-[16px] font-['Mitr'] font-normal text-[16px] text-white/75 text-center leading-none opacity-90">
                <span>มีบัญชีอยู่แล้ว? </span>
                <button
                  type="button"
                  onClick={() => switchMode("login")}
                  className="font-['Mitr'] font-medium text-[#fe595c] hover:underline cursor-pointer"
                >
                  เข้าสู่ระบบ
                </button>
              </p>
            </form>
          )}

          {mode === "otp" && (
            <form
              onSubmit={handleOtpSubmit}
              noValidate
              className="w-full flex flex-col items-center"
            >
              <h2 className="font-['Mitr'] font-medium text-[28px] text-white text-center leading-none">
                ยืนยันรหัส OTP
              </h2>
              <p className="font-['Mitr'] font-normal text-[14px] text-white/75 text-center leading-snug mt-[8px] max-w-[265px]">
                กรอกรหัส 6 หลักที่ส่งไปยังอีเมล
                <span className="block font-medium text-[#fec559] truncate mt-[2px]">
                  {regEmail || loginEmail}
                </span>
              </p>

              <div className="flex items-center justify-center gap-[7px] mt-[18px] w-full">
                {otpDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => {
                      otpInputRefs.current[idx] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    value={digit}
                    onChange={(e) => handleOtpDigitChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    onPaste={handleOtpPaste}
                    className={`w-[39px] h-[46px] rounded-[10px] border-2 bg-black/30 text-center font-['Mitr'] font-medium text-[22px] text-white focus:outline-none transition-all ${
                      digit
                        ? "border-[#fec559] shadow-[0_0_8px_rgba(254,197,89,0.25)]"
                        : "border-white/70 focus:border-[#fec559]"
                    }`}
                  />
                ))}
              </div>

              {infoMsg && !errorMsg && (
                <p className="mt-[10px] font-['Mitr'] font-normal text-[13px] text-[#8be28b] text-center leading-tight">
                  {infoMsg}
                </p>
              )}

              {errorMsg && (
                <p className="mt-[10px] font-['Mitr'] font-normal text-[13px] text-[#fe595c] text-center leading-tight">
                  {errorMsg}
                </p>
              )}

              <button
                type="submit"
                className="group relative mt-[18px] w-[146px] h-[38px] cursor-pointer btn-squish focus:outline-none select-none"
              >
                <div className="absolute -inset-x-[3.5px] -top-[3.5px] h-[46px] bg-[#cd5541] border-[3.5px] border-[#2e1406] rounded-[10px]" />
                <div className="absolute top-0 left-0 w-full h-[36px] bg-[#fec559] group-hover:bg-[#ffd074] border-[4px] border-[#f7daa4] rounded-[8px] transition-colors flex items-center justify-center">
                  <span className="font-['Mitr'] font-medium text-[16px] text-white [-webkit-text-stroke:5px_#2e1406] [paint-order:stroke_fill] leading-none mb-0.5">
                    ยืนยัน
                  </span>
                </div>
              </button>

              <div className="mt-[16px] flex flex-col items-center gap-[8px]">
                <p className="font-['Mitr'] font-normal text-[14px] text-white/75 text-center leading-none">
                  <span>ไม่ได้รับรหัส? </span>
                  <button
                    type="button"
                    disabled={resendCooldown > 0}
                    onClick={handleResendOtp}
                    className={`font-['Mitr'] font-medium transition-colors ${
                      resendCooldown > 0
                        ? "text-white/40 cursor-not-allowed"
                        : "text-[#fec559] hover:text-[#ffd074] hover:underline cursor-pointer"
                    }`}
                  >
                    {resendCooldown > 0
                      ? `ส่งรหัสใหม่ (${resendCooldown}s)`
                      : "ส่งรหัสใหม่อีกครั้ง"}
                  </button>
                </p>

                <button
                  type="button"
                  onClick={() => switchMode("register")}
                  className="font-['Mitr'] font-normal text-[13px] text-white/55 hover:text-white cursor-pointer transition-colors"
                >
                  ย้อนกลับไปแก้ไขอีเมล
                </button>
              </div>
            </form>
          )}

          {mode === "username" && (
            <form
              onSubmit={handleUsernameSubmit}
              noValidate
              className="w-full flex flex-col items-center"
            >
              <h2 className="font-['Mitr'] font-medium text-[28px] text-white text-center leading-none">
                ตั้งชื่อผู้ใช้
              </h2>
              <p className="font-['Mitr'] font-normal text-[15px] text-white/75 text-center leading-snug mt-[10px]">
                กรุณาตั้งชื่อผู้ใช้สำหรับแสดงในระบบ
              </p>

              <div className="mt-[22px] border-2 border-white/75 focus-within:border-[#fec559] h-[38px] w-[251px] rounded-[10px] flex items-center px-[12px] transition-colors">
                <input
                  type="text"
                  value={customUsername}
                  maxLength={20}
                  onChange={(e) => {
                    setCustomUsername(e.target.value);
                    if (errorMsg) setErrorMsg("");
                  }}
                  placeholder="ชื่อผู้ใช้ (ไม่เกิน 20 ตัวอักษร)"
                  autoFocus
                  className="w-full bg-transparent font-['Mitr'] font-normal text-[16px] text-white placeholder-white/50 focus:outline-none leading-none"
                />
              </div>

              {errorMsg && (
                <p className="mt-[8px] font-['Mitr'] font-normal text-[13px] text-[#fe595c] text-center leading-tight">
                  {errorMsg}
                </p>
              )}

              <button
                type="submit"
                className="group relative mt-[20px] w-[146px] h-[38px] cursor-pointer btn-squish focus:outline-none select-none"
              >
                <div className="absolute -inset-x-[3.5px] -top-[3.5px] h-[46px] bg-[#cd5541] border-[3.5px] border-[#2e1406] rounded-[10px]" />
                <div className="absolute top-0 left-0 w-full h-[36px] bg-[#fec559] group-hover:bg-[#ffd074] border-[4px] border-[#f7daa4] rounded-[8px] transition-colors flex items-center justify-center">
                  <span className="font-['Mitr'] font-medium text-[16px] text-white [-webkit-text-stroke:5px_#2e1406] [paint-order:stroke_fill] leading-none mb-0.5">
                    ยืนยัน
                  </span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => switchMode("login")}
                className="mt-[14px] font-['Mitr'] font-normal text-[14px] text-white/60 hover:text-white cursor-pointer transition-colors"
              >
                ย้อนกลับ
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginModal;