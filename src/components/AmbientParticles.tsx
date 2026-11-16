import { useMemo } from "react";

interface AmbientParticlesProps {
  variant?: "warm" | "sunlight";
  count?: number;
  className?: string;
}

interface ParticleConfig {
  id: number;
  left: string;
  bottom: string;
  size: number;
  duration: number;
  delay: number;
  driftX: number;
  color: string;
  glow: string;
  opacity: number;
}

export const AmbientParticles = ({
  variant = "warm",
  count = 20,
  className = "",
}: AmbientParticlesProps) => {
  const particles = useMemo<ParticleConfig[]>(() => {
    const palette =
      variant === "sunlight"
        ? [
            { color: "#fff3b0", glow: "rgba(255, 224, 115, 0.85)" },
            { color: "#fec559", glow: "rgba(254, 197, 89, 0.8)" },
            { color: "#ffffff", glow: "rgba(255, 255, 255, 0.75)" },
            { color: "#ffd89b", glow: "rgba(255, 190, 110, 0.75)" },
          ]
        : [
            { color: "#fec559", glow: "rgba(254, 197, 89, 0.85)" },
            { color: "#ffae52", glow: "rgba(255, 158, 68, 0.75)" },
            { color: "#fff1c1", glow: "rgba(255, 241, 193, 0.8)" },
            { color: "#ff8c61", glow: "rgba(255, 120, 80, 0.7)" },
          ];

    return Array.from({ length: count }, (_, i) => {
      const seed1 = ((i * 37 + 13) % 100) / 100;
      const seed2 = ((i * 61 + 29) % 100) / 100;
      const seed3 = ((i * 83 + 7) % 100) / 100;
      const tone = palette[i % palette.length];

      return {
        id: i,
        left: `${Math.round(4 + seed1 * 92)}%`,
        bottom: `${Math.round(seed2 * 75)}%`,
        size: Math.round(3 + seed3 * 6),
        duration: Number((5.5 + seed1 * 6.5).toFixed(2)),
        delay: Number((-seed2 * 10).toFixed(2)),
        driftX: Math.round((seed3 - 0.5) * 48),
        color: tone.color,
        glow: tone.glow,
        opacity: Number((0.4 + seed3 * 0.45).toFixed(2)),
      };
    });
  }, [count, variant]);

  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none select-none ${className}`}
      aria-hidden="true"
    >
      {/* Ambient soft light beams / glow */}
      {variant === "sunlight" ? (
        <>
          <div className="absolute -top-[12%] -left-[10%] w-[75%] h-[55%] rounded-full bg-radial from-[#fff2b2]/25 via-[#fec559]/10 to-transparent blur-2xl animate-ambient-pulse" />
          <div className="absolute top-[15%] -right-[15%] w-[65%] h-[45%] rounded-full bg-radial from-[#ffd584]/20 via-transparent to-transparent blur-2xl animate-ambient-pulse-delayed" />
        </>
      ) : (
        <>
          <div className="absolute top-[10%] left-[10%] w-[80%] h-[50%] rounded-full bg-radial from-[#fec559]/15 via-[#cd5541]/8 to-transparent blur-2xl animate-ambient-pulse" />
          <div className="absolute bottom-[15%] right-[5%] w-[65%] h-[45%] rounded-full bg-radial from-[#ffae52]/15 via-transparent to-transparent blur-2xl animate-ambient-pulse-delayed" />
        </>
      )}

      {/* Floating dust motes / particles */}
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute rounded-full animate-particle-rise"
          style={
            {
              left: p.left,
              bottom: p.bottom,
              width: `${p.size}px`,
              height: `${p.size}px`,
              backgroundColor: p.color,
              boxShadow: `0 0 ${p.size * 2.4}px ${p.glow}`,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
              "--particle-drift-x": `${p.driftX}px`,
              "--particle-max-opacity": p.opacity,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
};

export default AmbientParticles;
