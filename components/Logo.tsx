export default function Logo({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect width="48" height="48" rx="12" fill="var(--navy)" />
      <path d="M14 15h14M14 23h10" stroke="var(--gold)" strokeWidth="3" strokeLinecap="round" />
      <path d="M13 30.5l2.2 2.2L19.5 28" stroke="#F7F5F0" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="33" cy="31" r="8" fill="var(--gold)" />
      <rect x="30.4" y="26.5" width="5.2" height="7" rx="2.6" fill="var(--navy)" />
      <path d="M28.5 31.5a4.5 4.5 0 0 0 9 0" stroke="var(--navy)" strokeWidth="1.6" strokeLinecap="round" fill="none" />
      <path d="M33 36v2" stroke="var(--navy)" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
