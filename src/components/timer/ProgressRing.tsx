import styles from "./progress-ring.module.scss";

interface ProgressRingProps {
  size: number;
  progress: number;
  /** Hide from assistive tech when wrapped in a control that provides the label */
  decorative?: boolean;
  "aria-label"?: string;
}

export function ProgressRing({
  size,
  progress,
  decorative,
  "aria-label": ariaLabel,
}: ProgressRingProps) {
  const stroke = 6;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const clamped = Math.min(1, Math.max(0, progress));
  const offset = c * (1 - clamped);

  return (
    <svg
      width={size}
      height={size}
      className={styles.svg}
      role={decorative ? undefined : "img"}
      aria-hidden={decorative ? true : undefined}
      aria-label={decorative ? undefined : ariaLabel}
    >
      <circle className={styles.track} cx={size / 2} cy={size / 2} r={r} />
      <circle
        className={styles.progress}
        cx={size / 2}
        cy={size / 2}
        r={r}
        strokeDasharray={c}
        strokeDashoffset={offset}
      />
    </svg>
  );
}
