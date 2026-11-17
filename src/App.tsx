import { useState, useEffect, useCallback } from "react";
import { MainScreen } from "./screens/MainScreen";
import { HomeScreen } from "./screens/HomeScreen";
import { MissionMapScreen } from "./screens/MissionMapScreen";

type Screen = "main" | "home" | "map";
type TransitionPhase = "idle" | "closing" | "opening";

const DEFAULT_WIDTH = 485;
const DEFAULT_HEIGHT = 875;
const BASE_ASPECT = DEFAULT_WIDTH / DEFAULT_HEIGHT;

// Phone portrait aspect ratio bounds
const MIN_PHONE_ASPECT = 0.42;
const MAX_PHONE_ASPECT = 0.65;

// Allow slight horizontal flexibility
const MIN_VIRTUAL_WIDTH = 465;
const MAX_VIRTUAL_WIDTH = 510;

interface LayoutState {
  scale: number;
  width: number;
  height: number;
  isCapped: boolean;
}

const computeLayout = (): LayoutState => {
  if (typeof window === "undefined") {
    return {
      scale: 1,
      width: DEFAULT_WIDTH,
      height: DEFAULT_HEIGHT,
      isCapped: true,
    };
  }

  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const aspect = vw / vh;

  const isPhonePortrait =
    aspect >= MIN_PHONE_ASPECT && aspect <= MAX_PHONE_ASPECT;

  if (isPhonePortrait) {
    const ratioDelta = (aspect - BASE_ASPECT) / (MAX_PHONE_ASPECT - BASE_ASPECT);
    const clampedDelta = Math.max(-1, Math.min(1, ratioDelta));
    const virtualWidth =
      clampedDelta >= 0
        ? DEFAULT_WIDTH + clampedDelta * (MAX_VIRTUAL_WIDTH - DEFAULT_WIDTH)
        : DEFAULT_WIDTH + clampedDelta * (DEFAULT_WIDTH - MIN_VIRTUAL_WIDTH);

    const nextScale = vw / virtualWidth;
    const virtualHeight = vh / nextScale;

    return {
      scale: nextScale,
      width: virtualWidth,
      height: virtualHeight,
      isCapped: false,
    };
  }

  const scaleX = vw / DEFAULT_WIDTH;
  const scaleY = vh / DEFAULT_HEIGHT;
  const nextScale = Math.min(scaleX, scaleY);

  return {
    scale: nextScale,
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT,
    isCapped: true,
  };
};

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("main");
  const [username, setUsername] = useState("");
  const [transitionPhase, setTransitionPhase] =
    useState<TransitionPhase>("idle");

  const [layout, setLayout] = useState<LayoutState>(computeLayout);

  const handleResize = useCallback(() => {
    setLayout(computeLayout());
  }, []);

  useEffect(() => {
    document.title = "Anti-Smoke";
    // Wake up Render backend in background immediately on page load
    fetch("https://ctc-antismoke-api.onrender.com/api/ping").catch(() => {});

    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, [handleResize]);

  const navigateWithTransition = useCallback(
    (targetScreen: Screen, beforeSwitch?: () => void) => {
      if (transitionPhase !== "idle") return;
      setTransitionPhase("closing");

      setTimeout(() => {
        if (beforeSwitch) beforeSwitch();
        setCurrentScreen(targetScreen);
        setTransitionPhase("opening");

        setTimeout(() => {
          setTransitionPhase("idle");
        }, 420);
      }, 420);
    },
    [transitionPhase],
  );

  const handleLoginSuccess = (name: string) => {
    navigateWithTransition("home", () => {
      setUsername(name);
    });
  };

  return (
    <div
      className={`fixed inset-0 w-full h-[100dvh] bg-[#0b0202] overflow-hidden select-none ${
        layout.isCapped
          ? "flex items-center justify-center"
          : "flex items-start justify-center"
      }`}
    >
      {/* Blurred Outer Background (Shown on Desktop) */}
      {layout.isCapped && (
        <div className="fixed inset-0 bg-[url('/images/Sawthong_Field.jpg')] bg-cover bg-center bg-no-repeat w-full h-full brightness-[0.25] blur-sm pointer-events-none" />
      )}

      {/* Scaled Viewport Wrapper */}
      <div
        className="relative flex items-center justify-center shrink-0"
        style={{
          width: `${layout.width * layout.scale}px`,
          height: `${layout.height * layout.scale}px`,
        }}
      >
        {/* Boundary lines */}
        {layout.isCapped && (
          <>
            <div className="absolute right-full top-0 bottom-0 mr-[-1px] w-[4px] bg-black/30 pointer-events-none" />
            <div className="absolute left-full top-0 bottom-0 ml-[-1px] w-[4px] bg-black/30 pointer-events-none" />
          </>
        )}

        {/* Virtual Canvas */}
        <div
          style={{
            width: `${layout.width}px`,
            height: `${layout.height}px`,
            transform: `scale(${layout.scale})`,
            transformOrigin: "top left",
          }}
          className={`absolute top-0 left-0 overflow-hidden bg-black ${
            layout.isCapped ? "shadow-2xl" : ""
          }`}
        >
          {/* Active Screen */}
          {currentScreen === "main" && (
            <MainScreen onLoginSuccess={handleLoginSuccess} />
          )}

          {currentScreen === "home" && (
            <HomeScreen
              username={username}
              onExplore={() => navigateWithTransition("map")}
              onLogout={() => navigateWithTransition("main")}
              onUpdateUsername={setUsername}
            />
          )}

          {currentScreen === "map" && (
            <MissionMapScreen
              onBack={() => navigateWithTransition("home")}
            />
          )}

          {/* Page Transition Overlay */}
          {transitionPhase !== "idle" && (
            <div
              className="absolute -inset-[2px] z-50 pointer-events-auto overflow-hidden"
              aria-hidden="true"
            >
              <div
                className={`w-[calc(100%+4px)] h-[calc(100%+4px)] -ml-[2px] -mt-[2px] bg-[#080101] relative ${
                  transitionPhase === "closing"
                    ? "animate-wipe-cover-down"
                    : "animate-wipe-collapse-down"
                }`}
                style={{
                  transformOrigin:
                    transitionPhase === "closing"
                      ? "top center"
                      : "bottom center",
                }}
              >
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
