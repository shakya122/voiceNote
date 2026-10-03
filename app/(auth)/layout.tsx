import Logo from "@/components/Logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="auth-shell">
      <div className="auth-card">
        <div className="brand brand-center">
          <Logo />
          <span>VoiceNotes</span>
        </div>
        {children}
      </div>
    </div>
  );
}
