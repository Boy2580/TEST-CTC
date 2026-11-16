import { useState, useEffect } from "react";
import CustomBtn from "../components/CustomBtn";
import { LoginModal } from "../components/LoginModal";
import { AmbientParticles } from "../components/AmbientParticles";

interface MainScreenProps {
  onLoginSuccess?: (username: string) => void;
}

export const MainScreen = ({ onLoginSuccess }: MainScreenProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const preloadImage = (src: string) =>
      new Promise<void>((resolve) => {
        const img = new Image();
        img.src = src;

        const onDecoded = () => {
          if (typeof img.decode === "function") {
            img.decode().then(resolve).catch(() => resolve());
          } else {
            resolve();
          }
        };

        if (img.complete && img.naturalWidth > 0) {
          onDecoded();
        } else {
          img.onload = onDecoded;
          img.onerror = () => resolve();
        }
      });

    const preloadFonts = async () => {
      if (document.fonts) {
        try {
          await document.fonts.ready;
        } catch {}
      }
    };

    const imageSources = [
      "/images/Sawthong.png",
      "/images/Bedroom.png",
      "/images/Sawthong_Field.jpg",
      "/images/Logo.png",
      "/images/Hand_Icon.svg",
      "/images/Google_Icon.png",
      "/images/Lock_Icon.svg",
      "/images/Key_Icon.svg",
      "/images/Sep.svg",
      "/images/chars/Girl.png",
      "/images/Apple_Icon.png",
      "/images/Search_Icon.svg",
      "/images/Info_Btn.svg",
      "/images/Jagged.svg",
      "/images/Logout_Icon.svg",
      "/images/Map_Bg.png",
      "/images/Level_Book.png",
      "/images/Level_School.png",
      "/images/Level_Wordle.png",
      "/images/Banner_Red.svg",
      "/images/Banner_Purple.svg",
      "/images/Timeline_Line.svg",
      "/images/Timeline_Node.svg",
      "/images/Hand_Small.svg",
      "/images/Info_Small_Btn.svg",
      "/images/Back_Icon.svg",
    ];

    const assetsPromise = Promise.all([
      ...imageSources.map(preloadImage),
      preloadFonts(),
    ]);

    const minTimer = new Promise((resolve) => setTimeout(resolve, 800));
    const maxTimer = new Promise((resolve) => setTimeout(resolve, 20000));

    Promise.race([Promise.all([assetsPromise, minTimer]), maxTimer]).then(
      () => {
        if (isMounted) {
          setIsLoading(false);
        }
      },
    );

    return () => {
      isMounted = false;
    };
  }, []);

  const handleButtonClick = () => {
    setIsOverlayOpen(true);
  };

  return (
    <div className="relative w-full h-full overflow-hidden select-none">
      {/* Background and content wrapper */}
      <div
        className={`w-full h-full transition-[filter,transform,opacity] duration-300 ease-out ${
          isOverlayOpen
            ? "blur-[5px] brightness-75 pointer-events-none"
            : "blur-none brightness-100"
        }`}
      >
        {/* Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img
            src="/images/Bedroom.png"
            alt=""
            loading="eager"
            draggable={false}
            className={`w-full h-full object-cover object-[5%_100%] animate-bg-pan-main transition-[filter] duration-700 ease-out pointer-events-none ${
              isLoading ? "brightness-[0.35]" : "brightness-100"
            }`}
          />
        </div>

        {/* Ambient particles */}
        <AmbientParticles
          variant="warm"
          count={26}
          className={`z-[5] transition-opacity duration-700 ${
            isLoading ? "opacity-35" : "opacity-100"
          }`}
        />

        {/* Loading overlay */}
        <div
          className={`absolute inset-0 bg-black/40 transition-opacity duration-700 pointer-events-none ${
            isLoading ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Center content */}
        <div className="relative z-10 w-full h-full flex flex-col items-center justify-center gap-6">
          <div className="animate-float-slow flex items-center justify-center">
            <img
              src="/images/Logo.png"
              alt="Logo"
              className="w-[400px] max-w-[88%] h-auto object-contain drop-shadow-md"
            />
          </div>

          <div className="h-[48px] flex items-center justify-center">
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <span className="w-4 h-4 bg-[#fec559] border-3 border-[#2E1406] rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-4 h-4 bg-[#fec559] border-3 border-[#2E1406] rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-4 h-4 bg-[#fec559] border-3 border-[#2E1406] rounded-full animate-bounce"></span>
              </div>
            ) : (
              <div className="animate-btn-pop">
                <CustomBtn
                  onClick={handleButtonClick}
                  label="เข้าร่วมกิจกรรม"
                  iconSrc="/images/Hand_Icon.svg"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Login modal */}
      <LoginModal
        isOpen={isOverlayOpen}
        onClose={() => setIsOverlayOpen(false)}
        onLoginSuccess={(user) => {
          setIsOverlayOpen(false);
          console.log("Logged in:", user);
          onLoginSuccess?.(user);
        }}
      />
    </div>
  );
};

export default MainScreen;