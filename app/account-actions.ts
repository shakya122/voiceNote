"use server";
import { z } from "zod";
import { compare, hash } from "bcryptjs";
import { auth } from "@/lib/auth";
import { getUserById, updateUserPassword } from "@/lib/users";

export interface PasswordFormState { error: string; saved: boolean }

const Schema = z.object({
  currentPassword: z.string().min(1, "Enter your current password"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
});

export async function changePasswordAction(_prev: PasswordFormState, formData: FormData): Promise<PasswordFormState> {
  const session = await auth();
  if (!session?.user) return { error: "You need to be logged in.", saved: false };

  const parsed = Schema.safeParse({
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Check your details", saved: false };

  const user = await getUserById(session.user.id);
  if (!user) return { error: "Account not found.", saved: false };

  const ok = await compare(parsed.data.currentPassword, user.passwordHash);
  if (!ok) return { error: "Your current password is incorrect.", saved: false };

  await updateUserPassword(user.id, await hash(parsed.data.newPassword, 10));
  return { error: "", saved: true };
}
