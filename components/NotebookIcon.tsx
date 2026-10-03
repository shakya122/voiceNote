export default function NotebookIcon({ small = false }: { small?: boolean }) {
  const size = small ? 22 : 34;
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
      <rect x="8" y="4" width="26" height="32" rx="3" fill="var(--surface)" stroke="var(--navy)" strokeWidth="2" />
      <rect x="8" y="4" width="6" height="32" rx="2" fill="var(--navy)" />
      <circle cx="11" cy="11" r="1.3" fill="var(--gold)" />
      <circle cx="11" cy="20" r="1.3" fill="var(--gold)" />
      <circle cx="11" cy="29" r="1.3" fill="var(--gold)" />
      <path d="M19 13h11M19 19h11M19 25h7" stroke="var(--line)" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
