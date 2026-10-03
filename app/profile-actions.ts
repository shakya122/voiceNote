"use server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { updateUserProfile } from "@/lib/users";

const Schema = z.object({
  name: z.string().trim().min(1, "Enter a name").max(80),
  avatarDataUrl: z.string().max(400_000, "Photo is too large").nullable(),
});

export interface ProfileFormState { error: string; saved: boolean }

export async function updateProfileAction(_prev: ProfileFormState, formData: FormData): Promise<ProfileFormState> {
  const session = await auth();
  if (!session?.user) return { error: "You need to be logged in.", saved: false };

  const rawAvatar = formData.get("avatar");
  const avatar = typeof rawAvatar === "string" && rawAvatar.startsWith("data:image") ? rawAvatar : null;
  const parsed = Schema.safeParse({ name: formData.get("name"), avatarDataUrl: avatar });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input", saved: false };

  await updateUserProfile(session.user.id, parsed.data.name, parsed.data.avatarDataUrl);
  revalidatePath("/notes");
  revalidatePath("/profile");
  return { error: "", saved: true };
}
