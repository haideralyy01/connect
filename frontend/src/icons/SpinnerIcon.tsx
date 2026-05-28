export const SpinnerIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{
      animation: "spin 2s linear infinite",
    }}
    {...props}
  >
    <circle cx="12" cy="12" r="10"></circle>
    <path d="M12 6v6l4 2"></path>
  </svg>
);
