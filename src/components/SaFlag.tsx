export default function SaFlag({ className = "h-4 w-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 40" className={className} role="img" aria-label="South African flag">
      <rect width="60" height="20" fill="#E03C31" />
      <rect y="20" width="60" height="20" fill="#001489" />
      {/* white fimbriation */}
      <polygon points="0,0 26,20 0,40" fill="#fff" />
      <rect x="24" y="15.5" width="36" height="9" fill="#fff" />
      {/* green Y */}
      <polygon points="0,6 18,20 0,34" fill="#007749" />
      <rect x="16" y="17.5" width="44" height="5" fill="#007749" />
      {/* gold border + black triangle */}
      <polygon points="0,9.5 15.5,20 0,30.5" fill="#FFB81C" />
      <polygon points="0,12.5 12.5,20 0,27.5" fill="#000" />
    </svg>
  );
}
