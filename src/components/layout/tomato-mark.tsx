/**
 * Wide “beefsteak” tomato silhouette with bite — fills with `currentColor` (nav sets color).
 */
export function TomatoMark({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 96"
      width={38}
      height={30}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <mask id="pomodoroNavTomatoBite" maskUnits="userSpaceOnUse">
          <rect x="0" y="0" width="120" height="96" fill="white" />
          <circle cx="102" cy="46" r="15" fill="black" />
        </mask>
      </defs>
      {/* Wide oblate body */}
      <path
        fill="currentColor"
        mask="url(#pomodoroNavTomatoBite)"
        d="M60 22
           C32 22, 8 36, 8 56
           C8 80, 32 94, 60 94
           C88 94, 112 80, 112 56
           C112 36, 88 22, 60 22
           Z"
      />
      {/* Stem + calyx (same tone) */}
      <path
        fill="currentColor"
        d="M60 22
           C56 10, 58 4, 60 2
           C62 4, 64 10, 60 22
           Z
           M60 22
           C48 14, 34 12, 28 18
           C22 24, 38 26, 52 24
           Z
           M60 22
           C72 14, 86 12, 92 18
           C98 24, 82 26, 68 24
           Z"
      />
    </svg>
  );
}
