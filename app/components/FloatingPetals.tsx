const COLORS = ["#f8c9d8", "#fbd9e3", "#f3b9cc", "#fde8ee"];

const PETALS = [
  { left: 4, size: 14, dur: 22, delay: -4, sx: 50 },
  { left: 12, size: 10, dur: 28, delay: -16, sx: -40 },
  { left: 20, size: 16, dur: 24, delay: -9, sx: 60 },
  { left: 31, size: 11, dur: 30, delay: -21, sx: -50 },
  { left: 42, size: 15, dur: 26, delay: -2, sx: 40 },
  { left: 52, size: 9, dur: 32, delay: -13, sx: -60 },
  { left: 61, size: 13, dur: 23, delay: -18, sx: 50 },
  { left: 71, size: 17, dur: 27, delay: -7, sx: -45 },
  { left: 80, size: 10, dur: 31, delay: -24, sx: 55 },
  { left: 88, size: 14, dur: 25, delay: -11, sx: -40 },
  { left: 94, size: 11, dur: 29, delay: -1, sx: 45 },
  { left: 26, size: 12, dur: 34, delay: -27, sx: -55 },
];

export default function FloatingPetals() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {PETALS.map((p, i) => (
        <span
          key={i}
          className="petal"
          style={
            {
              left: `${p.left}%`,
              width: p.size,
              height: p.size * 1.25,
              backgroundColor: COLORS[i % COLORS.length],
              borderRadius: "70% 0 70% 0",
              animationDuration: `${p.dur}s`,
              animationDelay: `${p.delay}s`,
              "--sx": p.sx,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
