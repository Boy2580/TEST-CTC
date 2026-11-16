// Prevents pinch-to-zoom and gesture zooming across mobile and desktop
export function initPreventZoom() {
  if (typeof window === "undefined" || typeof document === "undefined") return;

  const preventDefault = (e: Event) => e.preventDefault();
  document.addEventListener("gesturestart", preventDefault);
  document.addEventListener("gesturechange", preventDefault);
  document.addEventListener("gestureend", preventDefault);

  document.addEventListener(
    "touchmove",
    (e) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    },
    { passive: false }
  );

  window.addEventListener(
    "wheel",
    (e) => {
      if (e.ctrlKey) {
        e.preventDefault();
      }
    },
    { passive: false }
  );

  window.addEventListener("keydown", (e) => {
    if (
      (e.ctrlKey || e.metaKey) &&
      (e.key === "+" || e.key === "-" || e.key === "=" || e.key === "0")
    ) {
      e.preventDefault();
    }
  });
}
