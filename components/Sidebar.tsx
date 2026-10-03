import Link from "next/link";
import Logo from "./Logo";
import { auth } from "@/lib/auth";
import { getUserById } from "@/lib/users";
import { logoutAction } from "@/app/auth-actions";

export default async function Sidebar() {
  const session = await auth();
  const user = session?.user ? await getUserById(session.user.id) : null;
  const name = user?.name ?? "Account";
  const initial = name.trim().charAt(0).toUpperCase() || "?";

  return (
    <nav className="sidebar" aria-label="Main">
      <Link href="/notes" className="brand">
        <Logo />
        <span>VoiceNotes</span>
      </Link>

      <ul className="nav">
        <li>
          <Link href="/notes">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 11.5 12 5l8 6.5M6 10v9h12v-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            Notes
          </Link>
        </li>
        <li>
          <Link href="/tools">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M14.7 6.3a4 4 0 0 1-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 0 1 5.4-5.4l-2.4 2.4-2-2 2.4-2.4Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/></svg>
            Tools
          </Link>
        </li>
        <li>
          <Link href="/settings">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/><path d="M19.4 13.5c.1-.5.1-1 0-1.5l1.9-1.5-2-3.4-2.2.9a7.6 7.6 0 0 0-1.3-.8L15.5 5h-4l-.3 2.2c-.5.2-.9.5-1.3.8l-2.2-.9-2 3.4L7.6 12c-.1.5-.1 1 0 1.5l-1.9 1.5 2 3.4 2.2-.9c.4.3.8.6 1.3.8L11.5 20h4l.3-2.2c.5-.2.9-.5 1.3-.8l2.2.9 2-3.4-1.9-1.5Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/></svg>
            Settings
          </Link>
        </li>
      </ul>

      <div className="sidebar-footer">
        <Link href="/profile" className="profile-card">
          <span className="avatar" aria-hidden="true">
            {user?.avatarDataUrl ? <img src={user.avatarDataUrl} alt="" /> : initial}
          </span>
          <span className="profile-text">
            <strong>{name}</strong>
            <small>Edit profile</small>
          </span>
        </Link>
        <form action={logoutAction}>
          <button type="submit" className="secondary logout-btn">Log out</button>
        </form>
      </div>
    </nav>
  );
}
