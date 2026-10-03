import Link from "next/link";
import ChangePasswordForm from "@/components/ChangePasswordForm";
import PreferencesForm from "@/components/PreferencesForm";

export default function SettingsPage() {
  return (
    <div className="page">
      <Link href="/notes" className="back-link">← Back to notes</Link>
      <h1>Settings</h1>

      <h2>Accessibility &amp; display</h2>
      <p className="lede">These are saved in this browser only.</p>
      <PreferencesForm />

      <h2>Change password</h2>
      <ChangePasswordForm />
    </div>
  );
}
