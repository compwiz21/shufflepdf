export function Logo({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <rect
        x="3"
        y="4"
        width="18"
        height="22"
        rx="3"
        fill="#FBBF24"
        transform="rotate(-8 12 15)"
      />
      <rect
        x="8"
        y="5"
        width="18"
        height="22"
        rx="3"
        fill="#7C3AED"
        transform="rotate(6 17 16)"
      />
      <path
        d="M14 12c0 2 2 3 4 4s4 2 4 4-2 3-4 3-4-1-4-3"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
