type Props = {
  colors: string[];
  size?: number;
  className?: string;
  animate?: boolean;
};

export function BraceletPreview({
  colors,
  size = 200,
  className = "",
  animate = false,
}: Props) {
  const radius = size * 0.36;
  const cx = size / 2;
  const cy = size / 2;
  const beadCount = 18;
  const beadR = size * 0.055;

  const beads = Array.from({ length: beadCount }, (_, i) => {
    const angle = (i / beadCount) * Math.PI * 2 - Math.PI / 2;
    const x = cx + Math.cos(angle) * radius;
    const y = cy + Math.sin(angle) * radius;
    const color = colors[i % colors.length];
    return { x, y, color, i };
  });

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={className}
      aria-label="Bracelet preview"
    >
      <defs>
        {colors.map((c, i) => (
          <radialGradient key={i} id={`bead-${i}-${size}`} cx="0.35" cy="0.35" r="0.8">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="35%" stopColor={c} />
            <stop offset="100%" stopColor={c} stopOpacity="0.7" />
          </radialGradient>
        ))}
      </defs>
      <circle
        cx={cx}
        cy={cy}
        r={radius}
        fill="none"
        stroke="#d4a574"
        strokeWidth="1"
        strokeDasharray="2 3"
        opacity="0.4"
      />
      {beads.map(({ x, y, i }) => (
        <circle
          key={i}
          cx={x}
          cy={y}
          r={beadR}
          fill={`url(#bead-${i % colors.length}-${size})`}
          className={animate ? "bead-float" : ""}
          style={animate ? { animationDelay: `${i * 0.1}s` } : {}}
        />
      ))}
    </svg>
  );
}
