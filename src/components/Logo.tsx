export const Logo = ({ className = "w-8 h-8" }: { className?: string }) => {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect x="20" y="40" width="160" height="120" rx="8" stroke="currentColor" strokeWidth="8" fill="none"/>
      <line x1="50" y1="70" x2="150" y2="70" stroke="currentColor" strokeWidth="6" strokeLinecap="round"/>
      <line x1="50" y1="100" x2="120" y2="100" stroke="currentColor" strokeWidth="6" strokeLinecap="round"/>
      <circle cx="155" cy="130" r="15" fill="currentColor"/>
      <path d="M145 127 L152 134 L165 121" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    </svg>
  );
};
