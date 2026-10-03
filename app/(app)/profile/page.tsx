import Link from "next/link";
import { auth } from "@/lib/auth";
import { getUserById } from "@/lib/users";
import ProfileForm from "@/components/ProfileForm";

export default async function ProfilePage() {
  const session = await auth();
  const user = await getUserById(session!.user.id);

  return (
    <div className="page">
      <Link href="/notes" className="back-link">← Back to notes</Link>
      <h1>Edit profile</h1>
      <p className="lede">Your name and photo are stored with your account.</p>
      <ProfileForm profile={{ name: user?.name ?? "", avatarDataUrl: user?.avatarDataUrl ?? null }} />
    </div>
  );
}
